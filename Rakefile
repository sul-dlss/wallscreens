# frozen_string_literal: true

require 'html-proofer'
require 'rubocop/rake_task'
require 'rspec/core/rake_task'

RuboCop::RakeTask.new(:rubocop)
RSpec::Core::RakeTask.new(:rspec)

desc 'Build site and run html-proofer'
task :html_proofer do
  sh 'bundle exec jekyll build'
  options = { assume_extension: true,
              check_html: true,
              disable_external: true,
              empty_alt_ignore: true,
              report_invalid_tags: true }
  HTMLProofer.check_directory('./_site', options).run
end

desc 'Run ESLint'
task :eslint do
  sh 'yarn run eslint js/'
end

desc 'Run Jest JavaScript tests'
task :jest do
  sh 'yarn run jest'
end

desc 'Run the full set of CI tasks'
task :ci do
  Rake::Task[:eslint].invoke
  Rake::Task[:rubocop].invoke
  Rake::Task[:html_proofer].invoke
  Rake::Task[:rspec].invoke
  Rake::Task[:jest].invoke
end
