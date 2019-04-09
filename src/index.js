import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'semantic-ui-css/components/accordion.min.css';
import Styled from 'styled-components';
import './style.css';
import { Accordion } from 'semantic-ui-react';
import _get from 'lodash/get';

const routePattern = /to\":\"\/(.*?)\"/g;

/**
 *  An accordion menu based on React Semantic UI library
 *
 * @version 1.0.0
 * @author [Mosè Raguzzini](https://github.com/bionicvapourboy)
 */
export default class SemanticAccordionMenu extends Component {

  state = {
    clicked: [],
  }
  
  /*
  * Accordion custom theme
  */
  StyledAccordion = Styled(Accordion)`
    background: transparent!important;

    .title {
      color: #fff!important;
      .icon {
        margin-right: 11px;
      }
    }

    > .title, > .title.active, > .title:hover {
      border-bottom: 1px solid ${this.props.separatorColor} !important;
      background-color: ${this.props.firstLevelBackgroundColor}!important;
    }

    > .content.active {
      background: ${this.props.submenuBackgroundColor};
      border-bottom: 1px solid ${this.props.separatorColor} !important;
    }
    .accordion {
      background: transparent!important;
      color: ${this.props.submenuFontColor};
      .title {
        color: ${this.props.submenuFontColor}!important;
      }

          background: rgba(255,255,255,.3);
    }

    .accordion .title .dropdown.icon,
    .title .dropdown.icon {
      float: right!important;
    }

    .itemWrapper a {
      padding: 10px 12px 10px 16px;
      display: block;
      margin-right: 3px;
    }

    .contentWrapper a {
      padding: 10px;
      padding-left: 10px;
      display: block;
      .icon{
        margin-right: 11px;
      }
    }

    .contentWrapper a.active, .itemWrapper a.active {
      background-color: ${this.props.activeColor}
    }
    
  `;
  
  /**
   * Item style wrapper for custom accordions
   */
  ItemStyle = {
    display: 'block',
    position: 'relative',
    margin: "-12px -16px",
  }

  /**
   * Content style wrapper for custom accordion.content
   */
  ContentStyle = {
    display: 'block',
    position: 'relative',   
  }

  /*
  * Click event on route links
  */
  itemClick = (event) => {
    this.setState({ clicked: []})
    event.stopPropagation();
  }
  
  /**
   * Check for routes in child NavLink of react-router
   */
  checkChildRoutes = (obj) => JSON.stringify(obj).match(routePattern).map(route => route.split("\"")[2]);
  
  /*
  * Wrapper for first level links
  */
  itemWrapper = (el) => ({ children: (<div className="itemWrapper" style={this.ItemStyle} onClick={this.itemClick}>{el}</div>)});

  /*
  * Wrapper for contents
  */
  contentWrapper = (el) => (<div className="contentWrapper" style={this.ContentStyle} onClick={this.itemClick}>{el}</div>);
  
  /*
  * Panel generator
  */
  getPanels = (objs) => objs.map(
    (obj) => ({ key: obj.id, active: this.isActivePanel(obj), onTitleClick: this.onTitleClick, title: obj.directLink ? this.itemWrapper(obj.title) : obj.title, content: { content: this.getContent(obj)}})
  )
  
  /*
  * Click handle on title to manage clicked elements in tree
  */
  onTitleClick = (e,data) => {
    // Get the already clicked elements
    const clicked = [...this.state.clicked];
    // Check if the clicked element is present in array
    const index = clicked.indexOf(data.content);
    if (index > -1) {
      // If present remove it
      clicked.splice(index, 1);
      this.setState({ clicked });
    } else {
      // If not present create it
      clicked.push(data.content);
      this.setState({ clicked });
    }
  }

  /*
  * Check wheter a panel is active or not based either on route
  * and if the element has beeen clicked
  */
  isActivePanel = (obj) => {
    // Default result
    let result = false;
    // Checks the route in current tree branch
    const childRoutes = this.checkChildRoutes(obj);
    // Checks if the tree contains an active route
    for(let i = 0; i < childRoutes.length; i += 1){
      if(window.location.href.includes(childRoutes[i])){
        result = true;
      }
    }
    // Checks if the object has been clicked
    if(this.state.clicked.indexOf(obj.title) > -1 ) {
      return !result;
    } else {
      return result;
    }
  }
  
  /*
  * Generate subacordions
  */
  getContent = (obj) => Array.isArray(_get(obj, 'sections'))  ? <Accordion.Accordion panels={this.getPanels(obj.sections || null )} /> : this.contentWrapper(obj.content);

  render() {
    const StyledAccordion = this.StyledAccordion;
    return (
      <div style={{ width: this.props.width, fontSize: this.props.fontSize }} className="accordion-menu">
        <StyledAccordion panels={this.getPanels(this.props.tree)} styled />
      </div>
    )
  }
}

SemanticAccordionMenu.propTypes = {
    /** An Array containing the configuration for menu tree */
    tree: PropTypes.array,
    /** Menu font size, default 13px */
    fontSize: PropTypes.number,
    /** Menu width, default 100% */
    width: PropTypes.string,
    /** SubMenu active content background color, default #ffffff */
    submenuBackgroundColor: PropTypes.string,
    /** SubMenu font color, default #000000 */
    submenuFontColor: PropTypes.string,
    /** Active color */
    activeColor: PropTypes.string,
    /** First level color */
    firstLevelBackgroundColor:  PropTypes.string,

  }

SemanticAccordionMenu.defaultProps = {
  tree: [],
  fontSize: 13,
  width: '100%',
  submenuBackgroundColor: '#ffffff',
  submenuFontColor: '#000000',
  separatorColor: '#cccccc',
  activeColor: '#266bc0',
  firstLevelBackgroundColor: '#003178',
};

