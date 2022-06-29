import PropTypes from 'prop-types';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, {treeItemClasses} from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import React from "react";
import {VersionProps} from "@/pages/design/version";
import "./index.less";


const StyledTreeItemRoot = styled(TreeItem)(({theme}) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props: any) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (

        <StyledTreeItemRoot

          label={
            <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
              <Box component={LabelIcon} color="inherit" sx={{mr: 1}}/>
              <Typography variant="body2" sx={{fontWeight: 'inherit', flexGrow: 1}}>
                <div className="droptarget" onDrop={(event) => {
                  event.preventDefault();

                }}
                     onDragOver={(event) => {
                       event.preventDefault();
                     }}>
                  <p onDragStart={(e) => {
                    console.log('开始拖')
                  }} draggable="true" id="dragtarget">拖动我!</p>
                </div>
              </Typography>
              <Typography variant="caption" color="inherit">
                {labelInfo}
              </Typography>
            </Box>
          }
          style={{
            '--tree-view-color': color,
            '--tree-view-bg-color': bgColor,
          }}
          {...other}
        />
  );
}

StyledTreeItem.propTypes = {
  nodeId: PropTypes.string,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};



const Test: React.FC<VersionProps> = (props) => {
  return (
    <>

      <TreeView
        style={{background: 'white'}}
        aria-label="gmail"
        onDragOver={
          () => {
            console.log('经过TreeView')

          }
        }
        defaultExpanded={['3']}
        defaultCollapseIcon={<ArrowDropDownIcon/>}
        defaultExpandIcon={<ArrowRightIcon/>}
        defaultEndIcon={<div style={{width: 24}}/>}
        sx={{height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}
      >
        <StyledTreeItem
          nodeId="1"
          labelText={"gmail"} labelIcon={MailIcon}/>
        <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon}/>
        <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label}/>
      </TreeView>
      <div style={{background: "white"}}>

        <div className="droptarget" onDrop={(event) => {
          event.preventDefault();

        }}
             onDragOver={(event) => {
               event.preventDefault();
             }}>
          <p onDragStart={(e) => {
            console.log('开始拖')
          }} draggable="true" id="dragtarget">拖动我!</p>
        </div>
        <div className="droptarget"
             onDrop={(e) => {
               console.log('放下')
             }}
             onDragOver={
               () => {
                 console.log('经过')

               }
             }></div>
      </div>

    </>
  );
}
export default React.memo(Test)
