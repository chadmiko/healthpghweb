class StaticController < ApplicationController

  layout 'finder'

  def show

    #return redirect_to('/') if current_user && params[:id] == 'login'

    map = {
      #"benefits" => "benefits_url",
      #"about" => "about_url",
      #"privacy" =>  "privacy_policy_url"
    }

    page = params[:id]
    
    #if site_setting_key = map[page]
    #  url = SiteSetting.send(site_setting_key)
    #  return redirect_to(url) unless url.blank?
    #end

    # Don't allow paths like ".." or "/" or anything hacky like that
    page.gsub!(/[^a-z0-9\_\-]/, '')

    file = "static/#{page}.#{I18n.locale}"

    # if we don't have a localized version, try the English one
    if not lookup_context.find_all("#{file}.html").any?
      file = "static/#{page}.en"
    end

    if not lookup_context.find_all("#{file}.html").any?
      file = "static/#{page}"
    end

    if lookup_context.find_all("#{file}.html").any?
      render file, layout: !request.xhr?, formats: [:html]
      return
    end

    raise HealthPGH::NotFound.new(:static)
  end

end
