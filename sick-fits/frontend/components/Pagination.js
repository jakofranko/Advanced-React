import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link'
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`

function Pagination({ page }) {
    return (
        <Query query={PAGINATION_QUERY}>
            {({ data, loading }) => {
                const { itemsConnection: { aggregate }} = data;
                const { count } = aggregate;
                const pages = Math.ceil(count / perPage);
                if (loading) return <p>Loading Pagination...</p>
                return (
                    <PaginationStyles>
                        <Head>
                            <title>
                                Sick Fits! - Page {page} of {pages}
                            </title>
                        </Head>
                        <Link
                            prefetch
                            href={{
                                pathname: 'items',
                                query: { page: page - 1 }
                            }}
                        >
                            <a className="prev" aria-disabled={page <= 1}>Prev</a>
                        </Link>
                        <p>Page {page ? page : '1'} of {pages}</p>
                        <Link
                            prefetch
                            href={{
                                pathname: 'items',
                                query: { page: page + 1 }
                            }}
                        >
                            <a className="next" aria-disabled={page >= pages}>Next</a>
                        </Link>
                    </PaginationStyles>
                );
            }}
        </Query>
    );
}

export default Pagination;
