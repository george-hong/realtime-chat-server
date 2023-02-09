import {
  IRequestWithLocale,
  IResponseBase,
} from './base.interface';

export interface IArticleListParams {
  pageNumber?: number;
  pageSize?: number;
  id?: number;        // authorId
}

export interface IArticleListPageParams extends IRequestWithLocale {
  query: IArticleListParams;
}

export interface IArticleListItem {
  id: number;
  title: string;
  summary: string;
  views: number;
}

export interface IRecommendArticlesResponseDetail {
  mostViews: Array<IArticleListItem>
}

export interface IRecommendArticlesResponse extends IResponseBase {
  data: IRecommendArticlesResponseDetail;
}

export interface IArticleListResponseDetail {
  count: number;
  data: Array<IArticleListItem>;
}

export interface IArticleListResponse extends IResponseBase {
  data: IArticleListResponseDetail;
}

export interface IArticleDetailPageParams extends IRequestWithLocale {
  query: {
    id?: string;
  }
}

export interface IArticleEditPageParams extends IRequestWithLocale {
  query: {
    id?: string;
  }
}


export interface IArticleDetail {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createTime: string;
  updateTime: string;
  nickName: string;
  avatar: string;
  views: number;
}

export interface IArticleDetailResponse extends IResponseBase {
  data: IArticleDetail;
}

export interface IArticleAddParams {
  title: string;
  content: string;
}

export interface IArticleEditParams extends IArticleAddParams {
  id: number;
}

export interface IArticleEditResponse extends IResponseBase {
  data: {
    id: number;
  }
}
