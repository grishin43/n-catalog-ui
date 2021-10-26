import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import {getCorrectBusinessObject} from './utils';

export default function ExtendedDocumentationPropertiesProvider(propertiesPanel, translate, eventBus, commandStack): any {
  propertiesPanel.registerProvider(this);

  const getValue = (businessObject) => {
    const documentation = businessObject && businessObject && businessObject.extendedDocumentation;
    return {extendedDocumentation: documentation};
  };

  const setValue = (businessObject, elem, values) => {
    return cmdHelper.updateBusinessObject(elem, businessObject, values);
  };

  this.getTabs = () => {
    return (entries) => {
      if (entries?.length) {
        const generalTab = entries.find((e) => e.id === 'general');
        if (generalTab?.groups?.length) {
          const documentationEntry = generalTab.groups.find((g) => g.id === 'documentation');
          if (documentationEntry?.entries?.length) {
            documentationEntry.entries.push(entryFactory.textField(translate, {
              id: 'extendedDocumentation',
              label: translate('Element extended documentation'),
              modelProperty: 'extendedDocumentation',
              buttonLabel: '\u{1F589}',
              disabled: () => true,
              buttonAction: {
                name: 'openWysiwygEditor',
                method: (elem, inputNode) => {
                  const bo = getCorrectBusinessObject(elem, false);
                  eventBus.fire('wysiwygEditor.open', {
                    element: elem,
                    node: inputNode,
                    data: getValue(bo).extendedDocumentation,
                    isProcessDocumentation: true,
                    eventBus
                  });
                  eventBus.once('wysiwygEditor.saveData', 999999, (event) => {
                    const {element, data, isProcessDocumentation} = event;
                    const updateElement = setValue(getCorrectBusinessObject(element, isProcessDocumentation), element, {
                      extendedDocumentation: data
                    });
                    if (updateElement) {
                      const oldValue = getValue(bo).extendedDocumentation;
                      const newValue = updateElement.context?.properties?.extendedDocumentation;
                      if (oldValue !== newValue) {
                        commandStack.execute(updateElement.cmd, updateElement.context);
                      }
                    }
                    return false;
                  });
                  return true;
                }
              },
              buttonShow: {
                name: 'showWysiwygEditor',
                method: () => true
              }
            }));
          }
        }
      }
      return entries;
    };
  };
}

ExtendedDocumentationPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'eventBus', 'commandStack'];
