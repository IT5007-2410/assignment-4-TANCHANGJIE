import React, { useState } from 'react';
import { 
    Table, 
    TableWrapper, 
    Row, 
    Rows, 
    Col, 
    Cols, 
    Cell 
} from 'react-native-table-component';
import { 
    View, 
    TextInput, 
    Text, 
    Button, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, ScrollView, StatusBar, useColorScheme } from 'react-native';


  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        }); // Add closing parenthesis here
        /****** Q4: Code Ends here******/
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception?.errors || []; 
          alert(`${error.message}:\n ${details.join('\n ')}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

  class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <View>
          <Text style={{ fontSize: 20 }}>Issue Filter</Text>
        </View>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: 'white'},
  header: {backgroundColor: '#FF6F61'},
  headertext: {textAlign: 'center',color: '#333333'},
  text: {textAlign: 'center',color: '#FF6F61'},
  dataWrapper: {marginTop: -1},
  row: {backgroundColor: 'white'},
  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10},
  button: {backgroundColor: '#333333', padding: 10, borderRadius: 5, alignItems: 'center'},
});

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData = [
      issue.id,
      issue.title,
      issue.status,
      issue.owner,
      issue.created.toDateString(),
      issue.effort,
      issue.due ? issue.due.toDateString() : '',
    ];
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row data={rowData} style={styles.row} textStyle={{ ...styles.text }} />
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }

  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHeader = ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
    {/****** Q2: Coding Ends here. ******/}
    return (
      <View style={styles.container}>
      {/****** Q2: Start Coding here to render the table header/rows.**********/}
        <Table borderStyle={{borderWidth: 1, borderColor: '#FF6F61'}}>
          <Row data={tableHeader} style={styles.header} textStyle={styles.headertext} />
        </Table>
        <View style={styles.dataWrapper}>
          {props.issues.map(issue => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </View>
      {/****** Q2: Coding Ends here. ******/}
      </View>
    );
  }

  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.state = {
        title: '',
        status: 'New',
        owner: '',
        effort: '',
        due: null,
        showDatePicker: false,
      };
  
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
  
      this.statusOptions = ['New', 'Assigned', 'Fixed', 'Closed'];
    }
  
    handleInputChange(field, value) {
      this.setState({ [field]: value });
    }
  
    handleSubmit() {
      const { title, status, owner, effort, due } = this.state;

      if (title.trim().length < 3) {
        alert('Title must be at least 3 characters long.');
        return;
      }

      if (status === 'Assigned' && !owner.trim()) {
        alert('Owner is required when status is "Assigned".');
        return;
      }

      const issue = {
        title: title.trim(),
        status: status,
        owner: owner.trim() || null,
        effort: effort ? parseInt(effort, 10) : null,
        due: due ? due.toISOString() : null,
      };

      this.props.createIssue(issue);

      this.setState({
        title: '',
        status: 'New',
        owner: '',
        effort: '',
        due: null,
        showDatePicker: false,
      });
    }
  
    render() {
      return (
        <View style={{ padding: 10 }}>
          <Text style={styles.headerText}>Add a New Issue</Text>
  
          {/* Title Input */}
          <View style={styles.form}>
            <Text style={styles.formText}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={this.state.title}
              onChangeText={(value) => this.handleInputChange('title', value)}
            />
          </View>
  
          {/* Status Picker */}
          <View style={styles.form}>
            <Text style={styles.formText}>Status</Text>
            <Picker
              selectedValue={this.state.status}
              onValueChange={(itemValue) => this.setState({ status: itemValue })}
              style={styles.picker}
            >
              {this.statusOptions.map((option) => (
                <Picker.Item label={option} value={option} key={option} />
              ))}
            </Picker>
          </View>
  
          {/* Owner Input */}
          <View style={styles.form}>
            <Text style={styles.formText}>Owner</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter owner"
              value={this.state.owner}
              onChangeText={(value) => this.handleInputChange('owner', value)}
            />
          </View>
  
          {/* Effort Input */}
          <View style={styles.form}>
            <Text style={styles.formText}>Effort</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter effort"
              keyboardType="numeric"
              value={this.state.effort}
              onChangeText={(value) => this.handleInputChange('effort', value)}
            />
          </View>
  
          {/* Due Date Picker */}
          <View style={styles.form}>
            <Text style={styles.formText}>Due Date</Text>
            <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
              <TextInput
                style={styles.input}
                placeholder="Select a due date"
                value={this.state.due ? this.state.due.toLocaleDateString() : ''}
                editable={false}
              />
            </TouchableOpacity>
            {this.state.showDatePicker && (
              <DateTimePicker
                value={this.state.due || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (event.type !== 'dismissed' && selectedDate) {
                    this.setState({ due: selectedDate, showDatePicker: false });
                  } else {
                    this.setState({ showDatePicker: false });
                  }
                }}
              />
            )}
          </View>
  
          {/* Submit Button */}
          <Button color='grey' title="Add a Issue" onPress={this.handleSubmit} />
        </View>
      );
    }
  }
  
  
  class BlackList extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      this.state = {
        name: '',
      };
    }
  
    handleOwnerChange(text) {
      this.setState({ name: text });
    }
  
    async handleSubmit() {
      const name = this.state.name;
      const query = `mutation addToBlacklist($name: String!) {
        addToBlacklist(nameInput: $name)
      }`;

      const data = await graphQLFetch(query, { name });
      this.setState({name: ''});
    }
  
    render() {
      return (
        <View style={{ padding: 10 }}>
          <TextInput
            style={styles.input}
            value={this.state.name}
            onChangeText={(text) => this.handleOwnerChange(text)}
          />
          <Button color='grey' title="Add to Blacklist" onPress={this.handleSubmit} />
        </View>
      );
    }
  }


export default class IssueList extends React.Component {
  constructor() {
      super();
      this.state = { issues: [], selector: 1 };
      this.createIssue = this.createIssue.bind(this);
  }
  
  componentDidMount() {
      this.loadData();
  }

  async loadData() {
      const query = `query {
          issueList {
              id title status owner
              created effort due
          }
      }`;

      const data = await graphQLFetch(query);
      if (data) {
          this.setState({ issues: data.issueList });
      }
  }

  async createIssue(issue) {
      const query = `mutation issueAdd($issue: IssueInputs!) {
          issueAdd(issue: $issue) {
              id
          }
      }`;

      const data = await graphQLFetch(query, { issue });
      if (data) {
          this.loadData();
      }
  }

  setSelector(value) {
    this.setState({ selector: value });
}
  render() {
      return (
      <>
          <View style={styles.nav}>
            <Button color='#FF6F61' title="IssueFilter" onPress={() => this.setSelector(1)}>IssueFilter</Button>
            <Button color='#FF6F61' title="IssueTable" onPress={() => this.setSelector(2)}>IssueTable</Button>
            <Button color='#FF6F61' title="IssueAdd" onPress={() => this.setSelector(3)}>IssueAdd</Button>
            <Button color='#FF6F61' title="BlackList" onPress={() => this.setSelector(4)}>BlackList</Button>
          </View>
          {/****** Q1: Start Coding here. ******/}
          {this.state.selector === 1 && <IssueFilter/>}
          {/****** Q1: Code ends here ******/}
          {/****** Q2: Start Coding here. ******/}
          {this.state.selector === 2 && <IssueTable issues={this.state.issues}/>}
          {/****** Q2: Code ends here ******/}
          {/****** Q3: Start Coding here. ******/}
          {this.state.selector === 3 && <IssueAdd createIssue={this.createIssue}/>}
          {/****** Q3: Code Ends here. ******/}
          {/****** Q4: Start Coding here. ******/}
          {this.state.selector === 4 && <BlackList/>}
          {/****** Q4: Code Ends here. ******/}
      </>
      );
  }
}

