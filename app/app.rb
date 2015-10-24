# app.rb
require 'sinatra'
require 'net/http'
require 'json'

get '/foo' do
  headers \
      "Access-Control-Allow-Origin"   => "*"

  content_type :json
  uri = URI('http://yi.baidu.com/pc/doctor/listdata')
  params = { :pageSize => 2, :page => 1, :departLevel1Id => 1, :provId => 1, :cityId => 1, :regionId => "all" }
  uri.query = URI.encode_www_form(params)
  res = Net::HTTP.get_response(uri)
  res.body if res.is_a?(Net::HTTPSuccess)
  # puts 'a' if res.body.is_a? String 
end