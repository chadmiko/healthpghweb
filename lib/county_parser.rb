require 'csv'

class CountyParser

  attr_reader :path

  def initialize( path )
    raise ArgumentError.new if (path.nil? || !File.exists?(path) || !File.readable?(path))
    @path = path
  end

  # 
  # Ex inputs: 
  #  Search by state name => { state_name: 'Pennsylvania' }
  #  Search by state code => { state_abbr: 'PA' }
  #    
  def search(criteria={})
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
