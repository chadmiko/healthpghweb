require 'metal_level'

class AcaPlanSerializer < ApplicationSerializer
  attributes :id, 
              :marketing_name,
              :metal_level_name,
              :metal_level_value,
              :network_type,
              :issuer_id,
              :issuer_name,
              :premium_age_27,
              :premium_age_21,
              :network_url,
              :formulary_url,
              :cost_sharing

  
  def metal_level_value
    object.metal_level
  end

  def metal_level_name
    MetalLevel.new(object.metal_level).to_s
  end

  def network_type
    object.network_type
  end

  def issuer_name
    object.issuer.name
  end

  def cost_sharing
    object.cost_sharing
  end
end
