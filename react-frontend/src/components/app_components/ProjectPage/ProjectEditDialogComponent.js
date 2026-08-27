/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
const statusOptions = [];
const visibilityOptions = [];

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const ProjectEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [teamMembers, setTeamMembers] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setTeamMembers(res.data.map((e) => { return { name: e['displayName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            name: _entity?.name,
description: _entity?.description,
startDate: _entity?.startDate,
endDate: _entity?.endDate,
status: _entity?.status,
visibility: _entity?.visibility,
        };

        setLoading(true);
        try {
            
        await client.service("project").patch(_entity._id, _data);
        const eagerResult = await client
            .service("project")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "teamMembers",
                    service : "users",
                    select:["displayName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info project updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const teamMembersOptions = teamMembers.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Project" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="project-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="name">Name:</label>
                <InputText id="name" className="w-full mb-3 p-inputtext-sm" value={_entity?.name} onChange={(e) => setValByKey("name", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["name"]) && (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="description">Description:</label>
                <InputTextarea id="description" rows={5} cols={30} value={_entity?.description} onChange={ (e) => setValByKey("description", e.target.value)} autoResize  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["description"]) && (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="startDate">Start Date:</label>
                <Calendar id="startDate" value={_entity?.startDate ? new Date(_entity?.startDate) : null} onChange={ (e) => setValByKey("startDate", new Date(e.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["startDate"]) && (
              <p className="m-0" key="error-startDate">
                {error["startDate"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="endDate">End Date:</label>
                <Calendar id="endDate" value={_entity?.endDate ? new Date(_entity?.endDate) : null} onChange={ (e) => setValByKey("endDate", new Date(e.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["endDate"]) && (
              <p className="m-0" key="error-endDate">
                {error["endDate"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="status">Status:</label>
                <Dropdown id="status" value={_entity?.status} options={statusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("status", e.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["status"]) && (
              <p className="m-0" key="error-status">
                {error["status"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="visibility">Visibility:</label>
                <Dropdown id="visibility" value={_entity?.visibility} options={visibilityOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("visibility", e.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["visibility"]) && (
              <p className="m-0" key="error-visibility">
                {error["visibility"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="teamMembers">Team Members:</label>
                <MultiSelect id="teamMembers" value={_entity?.teamMembers?.map((i) =>i._id)} options={teamMembersOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("teamMembers", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["teamMembers"]) && (
              <p className="m-0" key="error-teamMembers">
                {error["teamMembers"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ProjectEditDialogComponent);
