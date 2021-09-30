module Order
  class Generator < Jekyll::Generator
    def generate(site)
      site.data['experiences'].each do |_key, experience|
        ([nil] + experience['items'].to_a + [nil]).each_cons(3) do |items|
          prev_item, curr_item, next_item = items
          _key, value = curr_item
          value['previous'] ||= (prev_item&.first || 'index') + '.html'
          value['next'] ||= (next_item&.first || 'last') + '.html'
        end
      end
    end
  end
end
