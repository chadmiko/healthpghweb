require 'csv'

class QHPParser
  # extract rows from QHP Landscape file

  attr_reader :path

  def initialize( path )
    raise ArgumentError.new unless File.exists?(path) && File.readable?( path )
    @path = path
    @file = File.new( path )
  end

  # county_name must match 
  # Ex criteria:
  #   Search by state and county => {'state' => state_abbr, 'county_name' => county_name }
  #   Search by state => {'state' => state_abbr } 
  #
  def search( criteria )
    opts = { headers: :first_row }
    
    matches = nil
    headers = nil

    CSV.open( @path, 'r', opts) do |csv|
      matches = csv.find_all do |row|
        Hash[row].select {|k,v| criteria[k] } == criteria
      end
      headers = csv.headers
    end

    [headers, matches]
  end
end
