import { CategoriesListActionTypes, SetEditableForCategoriesAction } from '../../action-types';
import { API_URL } from '../../config';
import { createErrorResponseHandler, createSuccessJsonResponseHandler, createAsyncAction } from '../../helpers';
import { CategoryItem } from '../../models';

export const getCategories = createAsyncAction<
  CategoryItem[],
  {},
  // TODO: remove this duplicate strings along with *DispatchProp types
  // this was made for correct typing of legacy components
  CategoriesListActionTypes.Request,
  CategoriesListActionTypes.Success,
  CategoriesListActionTypes.Error
>(
  CategoriesListActionTypes.Request,
  CategoriesListActionTypes.Success,
  CategoriesListActionTypes.Error,
  {
    baseUrl: `${API_URL}/v1/categories`,
    method: 'GET',
    onSuccess: createSuccessJsonResponseHandler(),
    onError: createErrorResponseHandler('Failed to get categories'),
  },
  'Loading categories',
);

export const setEditableForCategories = (
  categoriesIds: number[],
  editable: boolean,
): SetEditableForCategoriesAction => {
  return {
    type: CategoriesListActionTypes.SetEditable,
    categoriesIds,
    editable,
  };
};
