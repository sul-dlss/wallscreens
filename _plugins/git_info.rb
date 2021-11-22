# Make version information from git available via site.git_info in templates
Jekyll::Hooks.register :site, :pre_render do |site, payload|
    site.config['git_info'] = `git describe --tags`
end
