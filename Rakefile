# frozen_string_literal: true

require 'html-proofer'
require 'rubocop/rake_task'

RuboCop::RakeTask.new(:rubocop)

desc 'Build site and run html-proofer'
task :html_proofer do
  sh 'bundle exec jekyll build'
  options = { alt_ignore: [/.*/],
              assume_extension: true,
              check_html: true,
              disable_external: true,
              report_invalid_tags: true }
  HTMLProofer.check_directory('./_site', options).run
end

desc 'Run the full set of CI tasks'
task :ci do
  Rake::Task['rubocop'].invoke
  Rake::Task['html_proofer'].invoke
end
