class MyQueryHelper{
  private query: any;
  private queryStr: any;

  constructor(query: any, queryStr: any){
    this.query = query;
    this.queryStr = queryStr;
  }

  search(queryKey: string){
      const queryValue: { [key: string] : any} = this.queryStr.queryValue 
      ? {
          [queryKey]: { 
            $regex: this.queryStr.queryValue,
            $options: 'i' 
          },
        } : {};

      this.query = this.query.find(queryValue);
      return this;
  }

  sort(){
    const sortOrder = this.queryStr.sort === 'desc' ? -1 : 1;
    this.query = this.query.sort({ createdAt: sortOrder });
    return this;
  }

  paginate(){
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
