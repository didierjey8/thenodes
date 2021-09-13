import React, { Component } from "react";
import "./FormStyles.css";
import Tree from "react-d3-tree";

import { sendData, sendFile } from "./requestFunctions";
import mainLogo from "../node.png";

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: 1,
      successMessage:
        "Welcome!. Upload your CSV file at the top left of the screen to deploy it!",
      nodeId: "",
      parent: "",
      description: "",
      nodename: "",
      read_only: 0,
      mread: "",
      messages: "",
      save: 1,
      showCreateform: 0,
      data: {
        name: "Base",
        children: [{ name: "1" }, { name: "2" }],
      },
    };
  }

  handleOnNodeClickCb = (nodeData, evt) => {
    let nodeId = nodeData.data.id;
    let parent = nodeData.data.parent;
    let description = nodeData.data.description;
    let name = nodeData.data.name;
    let read_only = nodeData.data.read_only;

    let mread = read_only === "1" ? "Yes" : "No";
    this.setState({
      nodeId: nodeId,
      nodename: name,
      parent: parent,
      description: description,
      read_only: read_only,
      mread: mread,
    });
  };

  handleRequest = (request) => {
    if (request.success) {
      let newId = request.id ? request.id : "";
      this.setState({
        success: 1,
        successMessage: "Done! " + newId,
      });
    } else {
      this.setState({
        success: 0,
        successMessage: request.error,
      });
    }
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        children: request.data,
      },
    }));
  };

  showUpdateForm = async () => {
    this.showFormCreate();
    this.setState({
      save: 0,
    });
  };

  showFormCreate = () => {
    this.setState({
      showCreateform: 1,
      save: 1,
    });
  };
  cancelFormCreate = () => {
    this.setState({
      showCreateform: 0,
    });
  };

  handleCreate = async () => {
    if (this.state.save === 1) {
      let obj = {
        parent: this.state.nodeId,
        node: {
          name: this.state.nodename,
          description: this.nodeDescription.value,
          read_only: this.nodeReadOnly.value,
        },
      };
      let request = await sendData("create_node", "POST", obj);
      console.log(request.data.id);
      this.setState({
        data: {
          name: "Base",
          children: [{ name: "1" }, { name: "2" }],
        },
      });

      this.handleRequest(request);
    } else {
      let id = this.state.nodeId;
      let name = this.state.nodename;

      let request = await sendData("update_node", "POST", {
        id,
        name,
      });

      this.handleRequest(request);
    }
  };
  handleDelete = async () => {
    let id = this.state.nodeId;

    let request = await sendData("delete_node", "POST", {
      id,
    });

    this.handleRequest(request);

    /*     this.setState((prevState) => ({
      data: {
        ...prevState.data,
        children: request,
      },
    })); */
  };

  handleFileChange = async (event) => {
    event.preventDefault();
    const filetoupload = this.filetoupload.files[0];
    let request = await sendFile("get_tree", "POST", filetoupload);

    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        children: request,
      },
    }));
  };
  render() {
    //console.log("Render" + JSON.stringify(this.state.data));
    return (
      <div className="container-fluid">
        <div class="row">
          <div class="col-9" style={{ marginTop: "30px" }}>
            <input
              ref={(ref) => (this.filetoupload = ref)}
              type="file"
              class="form-control"
              id="filetoupload"
              onChange={this.handleFileChange}
            />
            <div className="card space">
              <div id="treeWrapper" style={{ width: "100%", height: "600px" }}>
                <Tree
                  data={this.state.data}
                  orientation={"vertical"}
                  onNodeClick={this.handleOnNodeClickCb}
                />
              </div>
            </div>
          </div>
          <div className="col-3">
            <form style={{ marginTop: "65px" }}>
              <div
                class="card"
                style={{ width: "18rem", textAlign: "justify" }}
              >
                <span align="center">
                  <img
                    src={mainLogo}
                    style={{
                      width: "150px",
                      height: "auto",
                    }}
                    class="card-img-top"
                    alt="Node"
                  />
                </span>
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      Id: [{this.state.nodeId}] Name: {this.state.nodename}
                    </li>
                    <li class="list-group-item">
                      Readonly: <span>{this.state.mread}</span>
                    </li>
                    <li class="list-group-item" align="center">
                      <div
                        class="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <input
                          type="button"
                          class="btn btn-primary"
                          value="Update"
                          onClick={this.showUpdateForm}
                        />
                        <input
                          type="button"
                          class="btn btn-primary"
                          value="Create"
                          onClick={this.showFormCreate}
                        />
                        <input
                          type="button"
                          class="btn btn-primary"
                          value="Delete"
                          onClick={this.handleDelete}
                        />
                      </div>
                    </li>

                    <li
                      class="list-group-item"
                      align="center"
                      className={
                        this.state.showCreateform === 1 ? "show" : "hide"
                      }
                    >
                      <div class="col-auto">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Node Name..."
                          value={this.state.nodename}
                          onChange={(e) =>
                            this.setState({ nodename: e.target.value })
                          }
                        />
                      </div>
                      <div className={this.state.save === 1 ? "show" : "hide"}>
                        <div class="col-auto">
                          <input
                            ref={(ref) => (this.nodeDescription = ref)}
                            type="text"
                            class="form-control"
                            id="description"
                            placeholder="Description..."
                          />
                        </div>
                        <div class="col-auto">
                          <select
                            className="form-control"
                            ref={(ref) => (this.nodeReadOnly = ref)}
                          >
                            <option defaultValue="1">Read Only?</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-auto space">
                        <div
                          class="btn-group"
                          role="group"
                          aria-label="Basic example"
                        >
                          <input
                            type="button"
                            class="btn btn-primary"
                            value="Cancel"
                            onClick={this.cancelFormCreate}
                          />
                          <input
                            type="button"
                            class="btn btn-primary"
                            value="Save"
                            onClick={this.handleCreate}
                          />
                        </div>
                      </div>
                    </li>
                    <li class="list-group-item">
                      <div
                        className={
                          this.state.success === 1
                            ? "alert alert-primary"
                            : "alert alert-danger"
                        }
                        role="alert"
                      >
                        {this.state.successMessage}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
