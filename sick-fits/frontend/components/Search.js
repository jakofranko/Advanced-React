import React, { Component } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: {
            OR: [
                { title_contains: $searchTerm },
                { description_contains: $searchTerm }
            ]
        }) {
            id
            image
            title
        }
    }
`;

function routeToItem(item) {
    Router.push({
        pathname: '/item',
        query: {
            id: item.id
        }
    });
}

class Search extends Component {
    state = {
        items: [],
        loading: false
    }
    onChange = debounce(async (e, client) => {
        this.setState({ loading: true });
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: { searchTerm: e.target.value }
        });
        this.setState({
            items: res.data.items,
            loading: false
        });
    }, 350)
    render() {
        resetIdCounter();
        return (
            <SearchStyles>
                <Downshift
                    onChange={routeToItem}
                    itemToString={item => (item === null ? '' : item.title)}
                >
                    {({
                        getInputProps,
                        getItemProps,
                        isOpen,
                        inputValue,
                        highlightedIndex
                    }) => {
                        const { items, loading } = this.state;
                        return (
                            <div>
                                <ApolloConsumer>
                                    {(client) => {
                                        return (
                                            <input
                                                {...getInputProps({
                                                    type: "search" ,
                                                    placeholder: "Search",
                                                    id: "search",
                                                    className: loading ? 'loading' : '',
                                                    onChange: (e) => {
                                                        e.persist();
                                                        this.onChange(e, client);
                                                    }
                                                })}
                                            />
                                        );
                                    }}
                                </ApolloConsumer>
                                {isOpen && (
                                    <DropDown>
                                        {items.map((item, index) => {
                                            return (
                                                <DropDownItem
                                                    {...getItemProps({ item })}
                                                    key={item.id}
                                                    highlighted={index === highlightedIndex}
                                                >
                                                    <img src={item.image} alt={item.title} width="50" />
                                                    {item.title}
                                                </DropDownItem>
                                            );
                                        })}
                                        {!items.length && !loading && (
                                            <DropDownItem>Nothing found</DropDownItem>
                                        )}
                                    </DropDown>
                                )}
                            </div>
                        );
                    }}
                </Downshift>
            </SearchStyles>
        );
    }

}

export default Search;
