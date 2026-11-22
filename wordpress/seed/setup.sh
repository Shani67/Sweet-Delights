#!/usr/bin/env bash
# Installs WooCommerce + WPGraphQL + WooGraphQL and imports the demo catalog.
# Safe to run more than once.
set -euo pipefail

echo "Waiting for WordPress files..."
until [ -f /var/www/html/wp-config.php ]; do sleep 2; done

if ! wp core is-installed 2>/dev/null; then
  wp core install \
    --url="http://localhost:8080" \
    --title="Sweet Delights" \
    --admin_user=admin \
    --admin_password="$WP_ADMIN_PASSWORD" \
    --admin_email=admin@example.com \
    --skip-email
fi

wp rewrite structure '/%postname%/' --hard
wp plugin install woocommerce wp-graphql --activate
if ! wp plugin is-installed wp-graphql-woocommerce; then
  wp plugin install \
    https://github.com/wp-graphql/wp-graphql-woocommerce/releases/latest/download/wp-graphql-woocommerce.zip \
    --activate
fi
wp plugin activate wp-graphql-woocommerce

wp option update woocommerce_currency LKR
wp option update woocommerce_default_country LK
# Allow the setup to finish without the onboarding wizard.
wp option update woocommerce_onboarding_profile '{"skipped":true}' --format=json

wp eval-file /seed/import-catalog.php /seed-data/demo-catalog.json /seed-data/images

if [ -n "$REVALIDATE_SECRET" ]; then
  wp eval-file /seed/create-webhooks.php "$STOREFRONT_URL/api/revalidate" "$REVALIDATE_SECRET"
fi

echo
echo "Done. GraphQL endpoint: http://localhost:8080/graphql"
echo "Admin: http://localhost:8080/wp-admin (user: admin)"
