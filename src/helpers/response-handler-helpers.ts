import { Action, Dispatch } from 'redux';
import { ApiErrorResponseHandler, ApiSuccessResponseHandler } from './action-creator-helpers';

export type MessageDispatcher<A extends Action> = (dispatch: Dispatch<A>, message: string) => void;
export type ResponseTransformer<D> = (response: Response) => D | Promise<D>;

export function createErrorResponseHandler<A extends Action>(
  baseErrorMessage = 'Failed to fetch',
  responseTransformersByStatusCode: Record<number, ResponseTransformer<string>> = {},
): ApiErrorResponseHandler<A, string> {
  // Each response code (supported for handling) should have default error message
  const defaultErrorMessagesByStatusCode = {
    400: 'wrong request data',
    404: 'data not found',
    500: 'internal server error',
  } as Record<number, string>;

  function formatErrorMessage(errorMessage: string): string {
    return `${baseErrorMessage}: ${errorMessage}`;
  }

  return async (dispatch, response): Promise<string> => {
    if (!response) {
      return formatErrorMessage('server is not available');
    }

    const defaultErrorMessage = defaultErrorMessagesByStatusCode[response.status];
    if (!defaultErrorMessage) {
      return formatErrorMessage('unknown response code');
    }

    const responseTransformer = responseTransformersByStatusCode[response.status];
    if (!responseTransformer) {
      return formatErrorMessage(defaultErrorMessage);
    }

    const transformedErrorMessage = await responseTransformer(response);
    return formatErrorMessage(transformedErrorMessage);
  };
}

export function createSuccessJsonResponseHandler<A extends Action, D = {}>(): ApiSuccessResponseHandler<A, D> {
  return async (dispatch, response): Promise<D> => response.json();
}

export function createSuccessNumberResponseHandler<A extends Action>(): ApiSuccessResponseHandler<A, number> {
  return async (dispatch, response): Promise<number> => {
    const responseText = await response.text();

    if (isNaN(+responseText)) {
      throw new Error('Failed to convert text response to number');
    }

    return +responseText;
  };
}

export function createSuccessTextResponseHandler<A extends Action>(): ApiSuccessResponseHandler<A, string> {
  return async (dispatch, response): Promise<string> => response.text();
}

export function createSuccessBlobResponseHandler<A extends Action>(): ApiSuccessResponseHandler<A, Blob> {
  return async (dispatch, response): Promise<Blob> => response.blob();
}
