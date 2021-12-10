# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'file_or_link' do
  let(:site) { make_site }
  let(:page) { make_page }
  let(:context) { make_context }
  let(:rendered_tag) { parsed_tag.render(context) }
  before { site.process }

  describe 'local file exists' do
    let(:parsed_tag) do
      Liquid::Template.parse('{% file_or_link /local_file.html remote_url.html %}')
    end

    it 'renders the local file' do
      expect(rendered_tag).to eq('/local_file.html')
    end
  end

  describe 'local file does not exist' do
    let(:parsed_tag) do
      Liquid::Template.parse('{% file_or_link /not_here.html remote_url.html %}')
    end

    it 'renders remote URL' do
      expect(rendered_tag).to eq('remote_url.html')
    end
  end
end
