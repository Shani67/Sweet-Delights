<?php
/**
 * Creates WooCommerce webhooks that tell the storefront to revalidate when products change.
 *   wp eval-file create-webhooks.php <delivery-url> <secret>
 *
 * The storefront checks the x-revalidate-secret header, which WooCommerce does not send by
 * default, so a filter in the mu-plugin below adds it to every delivery.
 */

[$delivery_url, $secret] = $args;

$mu_dir = WPMU_PLUGIN_DIR;
wp_mkdir_p($mu_dir);
file_put_contents(
	"$mu_dir/sweet-delights-webhook-secret.php",
	"<?php\n// Added by wordpress/seed/create-webhooks.php\nadd_filter('woocommerce_webhook_http_args', function (\$args) {\n\t\$args['headers']['x-revalidate-secret'] = " . var_export($secret, true) . ";\n\treturn \$args;\n});\n"
);

foreach (['product.created', 'product.updated', 'product.deleted'] as $topic) {
	$existing = (new WC_Webhook_Data_Store())->search_webhooks(['search' => "Storefront: $topic"]);
	$webhook  = new WC_Webhook($existing[0] ?? 0);
	$webhook->set_name("Storefront: $topic");
	$webhook->set_topic($topic);
	$webhook->set_delivery_url($delivery_url);
	$webhook->set_status('active');
	$webhook->set_user_id(1);
	$webhook->save();
	WP_CLI::log("Webhook ready: $topic");
}
