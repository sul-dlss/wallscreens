# frozen_string_literal: true

RSpec.describe 'git_info' do
  let(:site) { make_site }
  before { site.process }

  it 'exists' do
    expect(site.config).to have_key('git_info')
  end

  it 'contains a string' do
    expect(site.config['git_info']).to be_a(String)
  end
end
