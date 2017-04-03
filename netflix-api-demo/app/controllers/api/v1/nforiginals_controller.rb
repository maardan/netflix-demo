class Api::V1::NforiginalsController < Api::V1::BaseController
  def index
    respond_with Nforiginal.all
  end

  def create
  end

  def asc
    @string = params[:category] + ' ASC'
    @string = @string.to_s
    respond_with Nforiginal.order(@string)
  end

  def desc
    @string = params[:category] + ' DESC'
    @string = @string.to_s   
    respond_with Nforiginal.order(@string)
  end

  def destroy
  end

  def update
  end

  private

  def Nforiginal_params
    params.require(:nforiginal).permit(:id, :title, :year, :rating, :genre)
  end
end 