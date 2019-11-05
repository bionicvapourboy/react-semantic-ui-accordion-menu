import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'semantic-ui-css/components/accordion.min.css';
import Styled from 'styled-components';
import './style.css';
import { Accordion, Popup } from 'semantic-ui-react';
import _get from 'lodash/get';
import { serialize, deserialize } from "react-serialize";

const routePattern = /to\":\"\/(.*?)\"/g;

const TitleTooltipWrapper = Styled.div` 
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  padding-left: 12px;
  padding-top: 9px;
`;

/**
 *  An accordion menu based on React Semantic UI library and NavLink from react-router v4
 *
 * @version 1.0.0
 * @author [Mosè Raguzzini](https://github.com/bionicvapourboy)
 */
export default class SemanticAccordionMenu extends Component {

  state = {
    clicked: [],
    tree: [],
  }

  componentDidMount() {
    // Typical usage (don't forget to compare props):
    if(this.props.tree) {
     this.setState({ tree: this.decorateTitles(this.props.tree) });
    }
  }

  decorateTitles = tree => tree.map(
    branch => ({ ...branch, title: (branch.sections || branch.content) ? this.addTitleTooltip(branch.title, branch.tooltip) : branch.title })
  )
  
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
      margin-top: 2px;
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
  checkChildRoutes = (obj) => serialize(obj).match(routePattern).map(route => route.split("\"")[2]);
  
  /*
  * Wrapper for first level links
  */
  itemWrapper = ({ title, tooltip }) => ({
    children: (
      <Popup
        content={tooltip}
        size="tiny"
        inverted
        disabled={!this.props.collapsed}       
        trigger={
          <div className="itemWrapper" style={this.ItemStyle} onClick={this.itemClick}>{title}</div>
        }
      />
    )
  });

  /*
  * Wrapper for contents
  */
  contentWrapper = (el) => (<div className="contentWrapper" style={this.ContentStyle} onClick={this.itemClick}>{el}</div>);
  
  addTitleTooltip = (title, tooltip) => {
    let clonedTitle = _.cloneDeep(title);
    if(title[0]){
    clonedTitle[0] = <Popup key="tooltip" ysize="tiny" inverted content={tooltip} position="center right" trigger={<TitleTooltipWrapper className="titleTooltipWrapper">{clonedTitle[0]}</TitleTooltipWrapper>} />;
      if(title[1]) {
        clonedTitle[1] = <div key="wrapper" className="titleWrapper">{title[0]} <span className="titleString">{clonedTitle[1]}</span></div>
      }
      return clonedTitle;
    }
    return title;
  }
  /*
  * Panel generator
  */
  getPanels = (objs) => objs.map(
    (obj) => ({
      key: obj.id, active: this.isActivePanel(obj),
      onTitleClick: this.onTitleClick,
      title: (!obj.sections && !obj.content) ?
        this.itemWrapper({ title: obj.title, tooltip: obj.tooltip }) :
        obj.title, 
      content: { content: this.getContent(obj) }
    })
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
  * Generate subaccordions
  */
  getContent = (obj) => Array.isArray(_get(obj, 'sections'))  ? <Accordion.Accordion panels={this.getPanels(obj.sections || null )} /> : this.contentWrapper(obj.content);

  render() {    
    const StyledAccordion = this.StyledAccordion;
    return (
      <div style={{ width: !this.props.collapsed ? this.props.width : this.props.collapsedWidth, fontSize: this.props.fontSize }} className={`accordion-menu${this.props.collapsed ? ' collapsed' : ''}`}>
        <StyledAccordion onClick={() => this.props.collapsed && this.props.openMenu()} panels={this.getPanels(this.state.tree)} styled />
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
    /** Collapsed menu */
    collapsed: PropTypes.bool,
    /** Open menu function */
    openMenu: PropTypes.func,
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
  collapsed: false,
  collapsedWidth: 39,
};


