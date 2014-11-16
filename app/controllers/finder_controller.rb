class FinderController < ApplicationController
 
  layout :set_layout 

  # GET /
  def aca
    county = fetch_county 
    plans = Coverage.find_plans_by_county( county.fips_code, 2015 )
    opts = {each_serializer: AcaPlanSerializer}
    @plans = ActiveModel::ArraySerializer.new(plans, opts).as_json
  end

  protected

  def fetch_county
    county = County.where(fips_code: params[:county]).first 
    raise Exception.new(:county) unless county
    #redirect_to out_of_service_area unless ServiceArea.contains?( county )
    county
  end

  def set_layout
    'finder'
  end
end
