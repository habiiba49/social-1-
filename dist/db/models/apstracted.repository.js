"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
class AbstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async update(filter, newData, options) {
        return this.model.findOneAndUpdate(filter, newData, options);
    }
    async delete(filter) {
        return this.model.deleteOne({ filter });
    }
    async getOne(filter) {
        return this.model.findOne(filter);
    }
}
exports.AbstractRepository = AbstractRepository;
