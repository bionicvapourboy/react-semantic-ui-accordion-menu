
# React Semantic UI Accordion Menu

An accordion menu built on top of react-semantic-ui package and react-dom

**Appearance**

![Recordit GIF](http://g.recordit.co/qheemZXedT.gif)

---

## Installation

**npm**
```bash
npm i react-semantic-ui-accordion-menu styled-components --save
```

**yarn**
```bash
yarn add react-semantic-ui-accordion-menu styled-components
```

---

### Props

| Prop | Type | Default value | Description |
| --- | --- | --- | --- |
| `tree`| _Array_ | `[]` | A config file representing the tree of the nested menu. See the [example](#Example) for reference |
| `fontSize`| _Number_ | 13 | Font size in px
| `width`| _String_ | 100% | Menu width
| `submenuBackgroundColor` | _String_ | #ffffff | Hex/RGB/RGBA background color for submenus |
| `submenuFontColor` | _String_ | #000000 | Hex/RGB/RGBA background color for submenu fonts
| `activeColor` | _String_ | #266bc0| Hex/RGB/RGBA background color for active links
| `firstLevelBackgroundColor` | _String_ | #003178| Hex/RGB/RGBA background color for first leve items

___

## Example

```javascript
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import Menu from 'react-semantic-ui-accordion-menu';
import { Icon } from 'semantic-ui-react';

const config  = [
  {
    id: "section-2",
    title: <NavLink exact to="/"><Icon name="home" />Home</NavLink>,
    content: null,
    directLink: true,
  },
  {
    id: "section-1",
    title: [<Icon key="sitemap" name="sitemap" />,"Section 1"],
    sections: [
      { 
        id: "section-1.1",
        title: [<Icon key="archive" name="archive" />,"Section 1.1"],
        route: "/about/",
        content: [<NavLink key="about" exact to="/about/"><Icon name="file alternate" />About</NavLink>, <NavLink key="test" exact to="/test/"><Icon name="folder open" />Test</NavLink>],
        },
      {
        id: "section-1.2",
        title: [<Icon key="calculator" name="calculator" />, "Section 1.2"],
        sections: [
          {
            id: "section-1.2.1",
            title: [<Icon key="camera" name="camera" />, "Section 1.2.1"],
            content: <NavLink exact to="/users/"><Icon name="users" />Users</NavLink>,
          }
        ]
      },
    ]
  },
];

const Index = () => <h2>Home</h2>;

const About = () => <h2>About</h2>;

const Users = () => <h2>Users</h2>;

const Test = () => <h2>Test</h2>;

class App extends Component {
  render() {
    return (
      <div className="App" style={{ paddingLeft: 215 }}>
      <Router>
        <div className="sidebar" style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 200, borderRight: '1px solid #ccc', backgroundColor: '#002657' }}>
          <Menu 
            tree={config}
            submenuBackgroundColor='#002657'
            submenuFontColor='#ffffff'
            separatorColor='rgba(255,255,255,.1)'
          />
        </div>
          <div className="content">
            <Route path="/" exact component={Index} />
            <Route path="/about/" component={About} />
            <Route path="/users/" component={Users} />
            <Route path="/test/" component={Test} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

```

