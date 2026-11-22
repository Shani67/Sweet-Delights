<?php
/**
 * Imports demo-catalog.json into WooCommerce. Run with:
 *   wp eval-file import-catalog.php <catalog.json> <images-dir>
 *
 * Products are matched by slug, so running it again updates instead of duplicating.
 */

[$catalog_file, $images_dir] = $args;

require_once ABSPATH . 'wp-admin/includes/image.php';

$catalog = json_decode(file_get_contents($catalog_file), true, 512, JSON_THROW_ON_ERROR);

$term_ids = [];
foreach ($catalog['categories'] as $category) {
	$existing = get_term_by('slug', $category['slug'], 'product_cat');
	$result   = $existing
		? wp_update_term($existing->term_id, 'product_cat', ['name' => $category['name'], 'description' => $category['description']])
		: wp_insert_term($category['name'], 'product_cat', ['slug' => $category['slug'], 'description' => $category['description']]);

	if (is_wp_error($result)) {
		WP_CLI::error($result->get_error_message());
	}
	$term_ids[$category['slug']] = (int) $result['term_id'];
}

function sweet_delights_import_image(string $path, string $alt): int {
	$upload = wp_upload_bits(basename($path), null, file_get_contents($path));
	if (!empty($upload['error'])) {
		WP_CLI::error($upload['error']);
	}

	$attachment_id = wp_insert_attachment(
		['post_mime_type' => wp_check_filetype($upload['file'])['type'], 'post_title' => $alt, 'post_status' => 'inherit'],
		$upload['file']
	);
	wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $upload['file']));
	update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt);

	return $attachment_id;
}

foreach ($catalog['products'] as $item) {
	$product_id = wc_get_product_id_by_sku($item['slug']);
	$product    = $product_id ? wc_get_product($product_id) : new WC_Product_Simple();

	$product->set_name($item['name']);
	$product->set_slug($item['slug']);
	$product->set_sku($item['slug']);
	$product->set_status('publish');
	$product->set_short_description($item['summary']);
	$product->set_description(wpautop($item['description']));
	$product->set_regular_price(number_format($item['price'] / 100, 2, '.', ''));
	$product->set_featured((bool) $item['featured']);
	$product->set_stock_status($item['inStock'] ? 'instock' : 'outofstock');
	$product->set_category_ids(array_map(fn ($slug) => $term_ids[$slug], $item['categories']));

	if (!$product->get_image_id()) {
		$product->set_image_id(sweet_delights_import_image("$images_dir/{$item['image']['file']}", $item['image']['alt']));
	}

	$product->save();
	WP_CLI::log(($product_id ? 'Updated ' : 'Created ') . $item['name']);
}

WP_CLI::success(sprintf('Imported %d products.', count($catalog['products'])));
