
export enum SearchCriteriaOperations {
    EqualTo = ":",
    Not = "<>",
    GreaterThan = ">",
    GreaterThanOrEqualTo = ">:",
    LowerThan = "<",
    LowerThanOrEqualTo ="<:",
}

export interface ISearchCriteria {
    key: string;
    operation: SearchCriteriaOperations;
    value: Object;
}