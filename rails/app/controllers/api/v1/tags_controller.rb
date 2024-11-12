class Api::V1::TagsController < Api::V1::ApplicationController
  def search
    search_term = params[:query].to_s.strip
    return head :no_content if search_term.blank?

    tags = fetch_tags(search_term)
    tags = append_term_if_not_in(tags, search_term)

    render json: tags, status: :ok
  end

  private

    def fetch_tags(search_term)
      Tag.where("name LIKE ?", "%#{ActiveRecord::Base.sanitize_sql_like(search_term)}%").
        order(notes_count: :desc).
        limit(10)
    end

    def append_term_if_not_in(tags, search_term)
      return tags if tags.any? {|tag| tag.name == search_term }

      tags.to_a << Tag.new(name: search_term)
    end
end
