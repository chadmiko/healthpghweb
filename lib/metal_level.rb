class MetalLevel
  CATASTROPHIC=1
  BRONZE=2
  SILVER=3
  GOLD=4
  PLATINUM=5

  attr_reader :id

  def initialize(id)
    @id = id
  end

  def to_s
    case @id
    when CATASTROPHIC then "Catastrophic"
    when BRONZE then "Bronze"
    when SILVER then "Silver"
    when GOLD then "Gold"
    when PLATINUM then "Platinum"
    else 
      'unknown'
    end 
  end
end
