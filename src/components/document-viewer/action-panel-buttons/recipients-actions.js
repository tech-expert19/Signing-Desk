import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getCompanies, getCompanyUsers, getContactsAsUsers } from "Actions";

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import useStyles from "./action-button-css";
import Recipients from './recipients';
import SigningOrder from './sigining-order';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

// const companies = [
//     { id: 'CompanyA', value: 'CompanyA', label: "CompanyA" },
//     { id: 'CompanyB', value: 'CompanyB', label: "CompanyB" },
//     { id: 'CompanyC', value: 'CompanyC', label: "CompanyC" },
// ]

// const users = [
//     { id: 'User1', value: "User1", label: "User1", firstName: 'User', lastName: "1", email: "user1@gmail.com" },
//     { id: 'User2', value: "User2", label: "User2", firstName: 'User', lastName: "2", email: "user2@gmail.com" },
//     { id: 'User3', value: "User3", label: "User3", firstName: 'User', lastName: "3", email: "user3@gmail.com" },
//     { id: 'User4', value: "User4", label: "User4", firstName: 'User', lastName: "4", email: "user4@gmail.com" },
//     { id: 'User5', value: "User5", label: "User5", firstName: 'User', lastName: "5", email: "user5@gmail.com" },
//     { id: 'User6', value: "User6", label: "User6", firstName: 'User', lastName: "6", email: "user6@gmail.com" }
// ];


class RecipientActions extends React.Component {
    users = null;
    companies = null;
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            loading: true,
            activeTab: '1',
            selectedUsers: [],
            selectedCompany: {},
            editingContact: '',
            isUsers: true,
            companies: []
        };
    }

    componentDidMount() {
        this.props.getContactsAsUsers();
        //this.props.getCompanyUsers();
        this.props.getCompanies();
    }

    deleteEditingContact = () => {
        if (this.state.editingContact) {
            this.setState({
                selectedUsers: this.state.selectedUsers.filter(user => user.id != this.state.editingContact.id),
                editingContact: ''
            })
        }
    }

    onSelectCompany = (company) => {
        this.setState({
            selectedCompany: company
        });
        this.props.getCompanyUsers({companyId : company.id});
    }

    onSelectUser = (user) => {
        if (this.state.selectedUsers.indexOf(user) !== -1) return;

        this.setState({
            selectedUsers: [...this.state.selectedUsers, user]
        });
    }

    onClickRecipient = (user) => {
        this.setState({
            editingContact: user
        })
    }
    onToggleUsers = () => {
        this.setState({
            isUsers: !this.state.isUsers
        })
        this.props.getCompanies();

        this.companies = this.props.companies;
    }
    clearEditingContact = () => {
        this.setState({
            editingContact: ''
        });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    switchUsers = () => {
        this.users = [];
        if (this.state.isUsers) {
            this.users = this.props.contacts;
        }
        else {
            if(this.props.companyUsers != null){
                this.users = this.props.companyUsers;
            }
            else{
                this.users = [];
            }
        }
    }
    toggleLoader =()=>{
        if (this.state.loading) {
            return (
                <RctSectionLoader />
            )
        }
    }

    render() {
        const { companies, companyUsers, contacts, loading } = this.props;
       
        this.toggleLoader();
        this.switchUsers();
        return (
            <div>
                {/* {
                    this.state.loading == true &&
                    <RctSectionLoader />
                } */}
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            style={{
                                borderColor: this.state.activeTab === '1' ? '#EBEDF2 #EBEDF2 #5D92F4 #F4F7FA' : '#EBEDF2 #EBEDF2 #F4F7FA',
                                borderBottomWidth: this.state.activeTab === '1' ? '2px' : "1px"
                            }}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Recipients
              </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            style={{
                                borderColor: this.state.activeTab === '2' ? '#EBEDF2 #EBEDF2 #5D92F4 #F4F7FA' : '#EBEDF2 #EBEDF2 #F4F7FA',
                                borderBottomWidth: this.state.activeTab === '2' ? '2px' : "1px"
                            }}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Signing Order
              </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">

                                {
                                    this.users &&
                                    <Recipients
                                        users={this.users}
                                        onSelectUser={this.onSelectUser}
                                        onSelectCompany={this.onSelectCompany}
                                        selectedUsers={this.state.selectedUsers}
                                        selectedCompany={this.state.selectedCompany}
                                        deleteEditingContact={this.deleteEditingContact}
                                        clearEditing={this.clearEditingContact}
                                        editingContact={this.state.editingContact}
                                        onClickRecipient={this.onClickRecipient}
                                        companies={this.companies}
                                        isUsers={this.state.isUsers}
                                        onClickToggleUsers={this.onToggleUsers} />
                                }



                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <SigningOrder selectedUsers={this.state.selectedUsers} onClickRecipient={() => { }} />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        );

    }
}

const mapStateToProps = ({ documentViewer }) => {
    const {companies, companyUsers, contacts } = documentViewer;
    
    return { companies,companyUsers, contacts };
}

export default withRouter(
    connect(mapStateToProps,
        {
            getCompanies,
            getCompanyUsers,
            getContactsAsUsers
        }
    )(RecipientActions));