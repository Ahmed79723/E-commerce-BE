export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }

  pagination() {
    let { page = 1, limit = 5 } = this.searchQuery;
    page = this.searchQuery.page * 1 || 1;
    page < 0 ? (page = 1) : page;
    limit > 50 ? (limit = 5) : limit;
    const skip = (parseInt(page) - 1) * limit;
    this.page = page;
    this.limit = limit;
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
  filter() {
    let filterObj = structuredClone(this.searchQuery);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/(lte|lt|gte|gt)/g, (value) => "$" + value);
    filterObj = JSON.parse(filterObj);
    const excludedFields = ["fields", "sort", "search"];
    excludedFields.forEach((val) => {
      delete filterObj[val];
    });
    this.mongooseQuery.find(filterObj);
    return this;
  }
  sort() {
    if (this.searchQuery.sort) {
      const sortBy = this.searchQuery.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  select() {
    if (this.searchQuery.fields) {
      const selectedFields = this.searchQuery.fields.split(",").join(" ");
      this.mongooseQuery.select(selectedFields);
    }
    return this;
  }
  search() {
    if (this.searchQuery.search) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.searchQuery.search, $options: "i" } },
          { description: { $regex: this.searchQuery.search, $options: "i" } },
          { name: { $regex: this.searchQuery.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}
