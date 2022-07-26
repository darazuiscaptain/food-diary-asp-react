import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useAppDispatch, useRefreshEffect, useAppSelector } from '../../__shared__/hooks';
import { allProductsSelected } from '../slice';
import { getProducts } from '../thunks';
import ProductsTableRow from './ProductsTableRow';

const ProductsTable: React.FC = () => {
  const productItems = useAppSelector(state => state.products.productItems);
  const productsFilter = useAppSelector(state => state.products.filter);
  const selectedProductsCount = useAppSelector(state => state.products.selectedProductIds.length);

  const areAllProductsSelected =
    productItems.length > 0 && productItems.length === selectedProductsCount;

  const dispatch = useAppDispatch();

  useRefreshEffect(
    state => state.products.operationStatus,
    () => {
      const { pageNumber, pageSize, productSearchName, category } = productsFilter;

      dispatch(
        getProducts({
          pageNumber,
          pageSize,
          productSearchName,
          categoryId: category?.id,
        }),
      );
    },
    [productsFilter],
  );

  const handleSelectAllProducts = (): void => {
    dispatch(allProductsSelected({ selected: !areAllProductsSelected }));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={
                  selectedProductsCount > 0 && selectedProductsCount < productItems.length
                }
                checked={areAllProductsSelected}
                onChange={handleSelectAllProducts}
                disabled={productItems.length === 0}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Calories cost</TableCell>
            <TableCell>Category</TableCell>
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
          {productItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="textSecondary">No products found</Typography>
              </TableCell>
            </TableRow>
          )}
          {productItems.map(product => (
            <ProductsTableRow key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductsTable;
