module Jekyll
    class FileOrLinkTag < Liquid::Tag
        def initialize(tag_name, params, tokens)
            super

            # assume two arguments and split on whitespace; note that this
            # means you can't use whitespace when interpolating:
            #
            # {% file_or_link {{a}} {{b}} %}      # ok
            # {% file_or_link {{ a }} {{ b }} %}  # will error
            @relative_path, @url = params.split(" ")
        end

        def render(context)
            @context = context

            # get path to the file as if we used {% link %}
            Jekyll::Tags::Link.send(:new, tag_name, @relative_path, parse_context).render(context)        

        # if we can't find the file, fall back to the url and warn
        rescue ArgumentError
            missing_path = Liquid::Template.parse(@relative_path).render(context)
            fallback_url = Liquid::Template.parse(@url).render(context)

            Jekyll.logger.warn("File \"#{missing_path}\" not found; falling back to #{fallback_url}")
            return fallback_url
        end
    end
end

Liquid::Template.register_tag('file_or_link', Jekyll::FileOrLinkTag)
