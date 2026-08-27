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
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
const statusOptions = [];
const priorityOptions = [];

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

const TaskEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [assignedPerson, setAssignedPerson] = useState([])
const [project, setProject] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setAssignedPerson(res.data.map((e) => { return { name: e['displayName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);
 useEffect(() => {
                    //on mount project
                    client
                        .service("project")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleProjectId } })
                        .then((res) => {
                            setProject(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Project", type: "error", message: error.message || "Failed get project" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            title: _entity?.title,
description: _entity?.description,
status: _entity?.status,
dueDate: _entity?.dueDate,
priority: _entity?.priority,
assignedPerson: _entity?.assignedPerson?._id,
project: _entity?.project?._id,
        };

        setLoading(true);
        try {
            
        await client.service("task").patch(_entity._id, _data);
        const eagerResult = await client
            .service("task")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "assignedPerson",
                    service : "users",
                    select:["displayName"]},{
                    path : "project",
                    service : "project",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info task updated successfully" });
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

    const assignedPersonOptions = assignedPerson.map((elem) => ({ name: elem.name, value: elem.value }));
const projectOptions = project.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Task" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="task-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="title">Title:</label>
                <InputText id="title" className="w-full mb-3 p-inputtext-sm" value={_entity?.title} onChange={(e) => setValByKey("title", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["title"]) && (
              <p className="m-0" key="error-title">
                {error["title"]}
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
                <label htmlFor="dueDate">Due Date:</label>
                <Calendar id="dueDate" value={_entity?.dueDate ? new Date(_entity?.dueDate) : null} onChange={ (e) => setValByKey("dueDate", new Date(e.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["dueDate"]) && (
              <p className="m-0" key="error-dueDate">
                {error["dueDate"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="priority">Priority:</label>
                <Dropdown id="priority" value={_entity?.priority} options={priorityOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("priority", e.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["priority"]) && (
              <p className="m-0" key="error-priority">
                {error["priority"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="assignedPerson">Assigned Person:</label>
                <Dropdown id="assignedPerson" value={_entity?.assignedPerson?._id} optionLabel="name" optionValue="value" options={assignedPersonOptions} onChange={(e) => setValByKey("assignedPerson", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["assignedPerson"]) && (
              <p className="m-0" key="error-assignedPerson">
                {error["assignedPerson"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="project">Project:</label>
                <Dropdown id="project" value={_entity?.project?._id} optionLabel="name" optionValue="value" options={projectOptions} onChange={(e) => setValByKey("project", {_id : e.value})}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["project"]) && (
              <p className="m-0" key="error-project">
                {error["project"]}
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

export default connect(mapState, mapDispatch)(TaskEditDialogComponent);
