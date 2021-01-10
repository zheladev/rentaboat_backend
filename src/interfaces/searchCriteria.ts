
export enum SearchCriteriaOperations {
    EqualTo = ":",
    Not = "<>",
    And = "AND",
    Or = "OR",
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