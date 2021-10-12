require 'yaml'
require 'liquid'

# Generate wallscreen slides from a template
task :generate_experience, [:wallscreen, :experience] do |_t, args|
  template_data = File.read("_wallscreens/#{args[:wallscreen]}/#{args[:experience]}/_template.html")
  experience = YAML.safe_load(File.read("_data/experiences/#{args[:experience]}.yaml"))
  template = Liquid::Template.parse template_data, error_mode: :strict

  experience['items'].each do |key, item|
    File.open("_wallscreens/#{args[:wallscreen]}/#{args[:experience]}/#{key}.html", 'w') do |f|
      f.puts template.render(
        { 'wallscreen' => args[:wallscreen], 'experience' => experience, 'item' => item, 'key' => key },
        strict_variables: true
      )
    end
  end
end
