# frozen_string_literal: true

# get necessary gems
require 'rspec'
require 'jekyll'

Jekyll.logger.log_level = :error

SOURCE_DIR = File.expand_path('fixtures', __dir__)
DEST_DIR   = File.expand_path('dest', __dir__)
PLUGINS_DIR = File.expand_path('../_plugins', __dir__)
JEKYLL_CONFIG = {
  'source' => SOURCE_DIR,
  'destination' => DEST_DIR,
  'plugins_dir' => [PLUGINS_DIR]
}.freeze

RSpec.configure do |_config|
  def make_page(options = {})
    page      = Jekyll::Page.new(site, JEKYLL_CONFIG['source'], '', 'index.html')
    page.data = options
    page
  end

  def make_site(options = {})
    site_config = Jekyll.configuration(JEKYLL_CONFIG.merge(options))
    Jekyll::Site.new(site_config)
  end

  def make_context(registers = {}, environments = {})
    Liquid::Context.new(environments, {},
                        { site: site, page: page }.merge(registers))
  end
end
