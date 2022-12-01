import React from 'react';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-json';
import "ace-builds/src-noconflict/mode-mysql";
import 'ace-builds/src-noconflict/mode-pgsql';
import 'ace-builds/src-noconflict/mode-sqlserver';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/ext-language_tools";

import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-xcode';
import {Ace} from "ace-builds";
import {IAceOptions, ICommand, IEditorProps, IMarker} from "react-ace/src/types";


export type CodeEditorProps = {
  name?: string;
  style?: React.CSSProperties;
  /** For available modes see https://github.com/thlorenz/brace/tree/master/mode */
  mode: string | object;
  /** For available themes see https://github.com/thlorenz/brace/tree/master/theme */
  theme?: string;
  height?: string;
  width?: string;
  className?: string;
  fontSize?: number | string;
  showGutter?: boolean;
  showPrintMargin?: boolean;
  highlightActiveLine?: boolean;
  focus?: boolean;
  cursorStart?: number;
  wrapEnabled?: boolean;
  readOnly?: boolean;
  minLines?: number;
  maxLines?: number;
  navigateToFileEnd?: boolean;
  debounceChangePeriod?: number;
  enableBasicAutocompletion?: boolean | string[];
  enableLiveAutocompletion?: boolean | string[];
  tabSize?: number;
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  scrollMargin?: number[];
  enableSnippets?: boolean;
  onSelectionChange?: (value: any, event?: any) => void;
  onCursorChange?: (value: any, event?: any) => void;
  onInput?: (event?: any) => void;
  onLoad?: (editor: Ace.Editor) => void;
  onValidate?: (annotations: Ace.Annotation[]) => void;
  onChange?: (value: string, event?: any) => void;
  onSelection?: (selectedText: string, event?: any) => void;
  onCopy?: (value: string) => void;
  onPaste?: (value: string) => void;
  onFocus?: (event: any, editor?: Ace.Editor) => void;
  onBlur?: (event: any, editor?: Ace.Editor) => void;
  onScroll?: (editor: IEditorProps) => void;
  editorProps?: IEditorProps;
  setOptions?: IAceOptions;
  keyboardHandler?: string;
  commands?: ICommand[];
  annotations?: Ace.Annotation[];
  markers?: IMarker[];
};

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const {mode, height, width, name, placeholder, value,theme, onChange} = props;
  console.log(63, mode || 'mysql');
  return (<>
    <AceEditor
      width={width || '100%'}
      height={height || '300px'}
      mode={mode || 'sql'}
      theme={theme || 'xcode'}
      placeholder={placeholder || ''}
      onChange={onChange}
      name={name || 'ace-editor'}
      value={value}
      editorProps={{$blockScrolling: true}}
      fontSize='14px'
      showGutter={true}
      highlightActiveLine={true}
      showPrintMargin={false}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false
      }}
    />
  </>);
}

export default React.memo(CodeEditor);
