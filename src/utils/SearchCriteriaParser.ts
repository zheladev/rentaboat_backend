import { Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm";
import { ISearchCriteria, SearchCriteriaOperations } from "../interfaces/searchCriteria";
import { getEnumKeyByEnumValue } from "./enumUtils";

export const searchCriteriaOperationToTypeORMOperator = {
    [SearchCriteriaOperations.EqualTo]: Equal,
    [SearchCriteriaOperations.Not]: Not,
    [SearchCriteriaOperations.LowerThan]: LessThan,
    [SearchCriteriaOperations.LowerThanOrEqualTo]: LessThanOrEqual,
    [SearchCriteriaOperations.GreaterThan]: MoreThan,
    [SearchCriteriaOperations.GreaterThanOrEqualTo]: MoreThanOrEqual,
}

export /**
 * Reduces ISearchCriteria array into TypeORM Entity data
 *
 * @category Utils
 * @param {ISearchCriteria[]} sca
 * @return {*} 
 */
const parseSearchCriteriaToTypeORMWhereClause = (sca: ISearchCriteria[]) => {
    const typeORMWhereClause = sca.reduce((obj, sc) => {
        obj[sc.key] = searchCriteriaOperationToTypeORMOperator[sc.operation](sc.value);
        return obj;
    }, {});

    return typeORMWhereClause;
}

export /**
 * Parses search query string into ISearchCriteria array
 *
 * @category Utils
 * @param {string} rawStr
 * @return {*}  {ISearchCriteria[]}
 */
const parseSearchCriteriaStr = (rawStr: string): ISearchCriteria[] => {
    const regex: RegExp = /(\w+?)(:|<>|>:|<:|<|>)([\w'-_\ ]+?|[0-9]+?),/g;
    const searchCriteriaStrArr: RegExpMatchArray[] = [...rawStr.matchAll(regex)];
    const searchCriteriaArr: ISearchCriteria[] = searchCriteriaStrArr.map(sc => {
        return {
            key: sc[1],
            operation: SearchCriteriaOperations[getEnumKeyByEnumValue(SearchCriteriaOperations, sc[2])],
            value: sc[3]
        }
    });

    return searchCriteriaArr;
}

