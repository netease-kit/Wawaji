package com.netease.mmc.demo.common.mybatis.generator.plugins;

import java.util.List;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.mybatis.generator.api.IntrospectedColumn;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.api.dom.OutputUtilities;
import org.mybatis.generator.api.dom.xml.Attribute;
import org.mybatis.generator.api.dom.xml.Element;
import org.mybatis.generator.api.dom.xml.TextElement;
import org.mybatis.generator.api.dom.xml.XmlElement;

/**
 * MySqlCreatedAtUpdatedAtColumnAutoGeneratePlugin created_at 和 updated_at 值自动以now()函数替换
 *
 * @author hzzhanghan
 * @date 2016/10/28
 * @since 1.0
 */
public class MySqlCreatedAtUpdatedAtColumnAutoGeneratePlugin extends PluginAdapter {

    private boolean hasCreatedAt;

    private boolean hasUpdatedAt;

    @Override
    public boolean validate(List<String> list) {
        return true;
    }

    @Override
    public void initialized(IntrospectedTable introspectedTable) {
        IntrospectedColumn createdAtColumn = introspectedTable.getColumn("created_at");
        if (createdAtColumn != null) {
            hasCreatedAt = true;
            createdAtColumn.setGeneratedAlways(true);
        } else {
            hasCreatedAt = false;
        }
        IntrospectedColumn updatedAtColumn = introspectedTable.getColumn("updated_at");
        if (updatedAtColumn != null) {
            hasUpdatedAt = true;
            updatedAtColumn.setGeneratedAlways(true);
        } else {
            hasUpdatedAt = false;
        }
        super.initialized(introspectedTable);
    }

    private XmlElement generateCreatedAtInsertChooseXmlElement(boolean addCommaSuffix) {
        XmlElement createdAtChooseXmlElement = new XmlElement("choose");
        XmlElement createdAtWhenXmlElement = new XmlElement("when");
        createdAtWhenXmlElement.addAttribute(new Attribute("test", "createdAt != null"));
        createdAtWhenXmlElement.addElement(new TextElement(addCommaSuffix ? "#{createdAt}," : "#{createdAt}"));
        XmlElement createdAtOtherwiseXmlElement = new XmlElement("otherwise");
        createdAtOtherwiseXmlElement.addElement(new TextElement(addCommaSuffix ? "now()," : "now()"));
        createdAtChooseXmlElement.addElement(createdAtWhenXmlElement);
        createdAtChooseXmlElement.addElement(createdAtOtherwiseXmlElement);
        return createdAtChooseXmlElement;
    }

    private XmlElement generateUpdatedAtInsertChooseXmlElement(boolean addCommaSuffix) {
        XmlElement updatedAtChooseXmlElement = new XmlElement("choose");
        XmlElement updatedAtWhenXmlElement = new XmlElement("when");
        updatedAtWhenXmlElement.addAttribute(new Attribute("test", "updatedAt != null"));
        updatedAtWhenXmlElement.addElement(new TextElement(addCommaSuffix ? "#{updatedAt}," : "#{updatedAt}"));
        XmlElement updatedAtOtherwiseXmlElement = new XmlElement("otherwise");
        updatedAtOtherwiseXmlElement.addElement(new TextElement(addCommaSuffix ? "now()," : "now()"));
        updatedAtChooseXmlElement.addElement(updatedAtWhenXmlElement);
        updatedAtChooseXmlElement.addElement(updatedAtOtherwiseXmlElement);
        return updatedAtChooseXmlElement;
    }

    private XmlElement generateUpdatedAtChooseXmlElement(boolean addCommaSuffix) {
        XmlElement updatedAtChooseXmlElement = new XmlElement("choose");
        XmlElement updatedAtWhenXmlElement = new XmlElement("when");
        updatedAtWhenXmlElement.addAttribute(new Attribute("test", "updatedAt != null"));
        updatedAtWhenXmlElement.addElement(
                new TextElement(addCommaSuffix ? "updated_at = #{updatedAt}," : "updated_at = #{updatedAt}"));
        XmlElement updatedAtOtherwiseXmlElement = new XmlElement("otherwise");
        updatedAtOtherwiseXmlElement
                .addElement(new TextElement(addCommaSuffix ? "updated_at = now()," : "updated_at = now()"));
        updatedAtChooseXmlElement.addElement(updatedAtWhenXmlElement);
        updatedAtChooseXmlElement.addElement(updatedAtOtherwiseXmlElement);
        return updatedAtChooseXmlElement;
    }

    @Override
    public boolean sqlMapInsertElementGenerated(XmlElement element, IntrospectedTable introspectedTable) {
        if (!hasCreatedAt && !hasUpdatedAt) {
            return super.sqlMapInsertElementGenerated(element, introspectedTable);
        }
        for (int i = 0, size = element.getElements().size(); i < size; i++) {
            if (element.getElements().get(i) instanceof TextElement) {
                TextElement textElement = (TextElement) element.getElements().get(i);
                if (!textElement.getContent().contains(")")) {
                    continue;
                }
                if (!textElement.getContent().trim().startsWith(")")) {
                    // replace and add
                    element.getElements().set(i, new TextElement(textElement.getContent().replace(")", ",")));
                    element.getElements().add(i + 1, new TextElement(")"));
                } else {
                    i--;
                    element.getElements().set(i,
                            new TextElement(((TextElement) element.getElements().get(i)).getContent() + ","));
                }
                StringBuilder insertClause = new StringBuilder("");
                OutputUtilities.xmlIndent(insertClause, 1);
                if (hasCreatedAt && hasUpdatedAt) {
                    insertClause.append("created_at, updated_at");
                } else if (hasCreatedAt) {
                    insertClause.append("created_at");
                } else if (hasUpdatedAt) {
                    insertClause.append("updated_at");
                }
                element.getElements().add(i + 1, new TextElement(insertClause.toString()));
                break;
            }
        }
        for (int i = element.getElements().size() -1; i > 0; i--) {
            if (element.getElements().get(i) instanceof TextElement) {
                TextElement textElement = (TextElement) element.getElements().get(i);
                if (!textElement.getContent().contains(")")) {
                    continue;
                }
                if (!textElement.getContent().trim().startsWith(")")) {
                    // replace and add
                    element.getElements().set(i, new TextElement(textElement.getContent().replace(")", ",")));
                    element.getElements().add(i + 1, new TextElement(")"));
                } else {
                    i--;
                    element.getElements().set(i,
                            new TextElement(((TextElement) element.getElements().get(i)).getContent() + ","));
                }
                if (hasCreatedAt && hasUpdatedAt) {
                    element.getElements().add(i + 1, generateCreatedAtInsertChooseXmlElement(true));
                    element.getElements().add(i + 2, generateUpdatedAtInsertChooseXmlElement(false));
                } else if (hasCreatedAt) {
                    element.getElements().add(i + 1, generateCreatedAtInsertChooseXmlElement(false));
                } else if (hasUpdatedAt) {
                    element.getElements().add(i + 1, generateUpdatedAtInsertChooseXmlElement(false));
                }

                break;
            }
        }
        return super.sqlMapInsertElementGenerated(element, introspectedTable);
    }

    @Override
    public boolean sqlMapInsertSelectiveElementGenerated(XmlElement element, IntrospectedTable introspectedTable) {
        if (!hasCreatedAt && !hasUpdatedAt) {
            return super.sqlMapInsertSelectiveElementGenerated(element, introspectedTable);
        }
        List<Element> elementList = element.getElements();
        XmlElement insertClauseXmlElement = null;
        XmlElement valueClauseXmlElement = null;
        for (Element ele : elementList) {
            if (ele instanceof XmlElement) {
                XmlElement xmlElement = (XmlElement) ele;
                if (!Objects.equals(xmlElement.getName(),"trim")) {
                    continue;
                }
                if (insertClauseXmlElement == null) {
                    insertClauseXmlElement = xmlElement;
                } else {
                    valueClauseXmlElement = xmlElement;
                    break;
                }
            }
        }
        if (insertClauseXmlElement != null) {
            if (hasCreatedAt && hasUpdatedAt) {
                insertClauseXmlElement.addElement(new TextElement("created_at, updated_at, "));
            } else if (hasCreatedAt) {
                insertClauseXmlElement.addElement(new TextElement("created_at, "));
            } else if (hasUpdatedAt) {
                insertClauseXmlElement.addElement(new TextElement("updated_at, "));
            }
        }
        if (valueClauseXmlElement != null) {
            if (hasCreatedAt && hasUpdatedAt) {
                valueClauseXmlElement.addElement(generateCreatedAtInsertChooseXmlElement(true));
                valueClauseXmlElement.addElement(generateUpdatedAtInsertChooseXmlElement(true));
            } else if (hasCreatedAt) {
                valueClauseXmlElement.addElement(generateCreatedAtInsertChooseXmlElement(true));
            } else if (hasUpdatedAt) {
                valueClauseXmlElement.addElement(generateUpdatedAtInsertChooseXmlElement(true));
            }
        }
        return super.sqlMapInsertSelectiveElementGenerated(element, introspectedTable);
    }

    private void generateUpdatedAtUpdateSelectiveXmlElement(XmlElement element) {
        if (!hasUpdatedAt) {
            return;
        }
        for (Element ele : element.getElements()) {
            if (ele instanceof TextElement) {
                continue;
            }
            XmlElement xmlElement = (XmlElement) ele;
            if (StringUtils.equalsIgnoreCase(xmlElement.getName(), "set")) {
                xmlElement.addElement(generateUpdatedAtChooseXmlElement(true));
                break;
            }
        }
    }

    @Override
    public boolean sqlMapUpdateByPrimaryKeySelectiveElementGenerated(XmlElement element,
            IntrospectedTable introspectedTable) {
        generateUpdatedAtUpdateSelectiveXmlElement(element);
        return super.sqlMapUpdateByPrimaryKeySelectiveElementGenerated(element, introspectedTable);
    }

    @Override
    public boolean sqlMapUpdateByExampleSelectiveElementGenerated(XmlElement element,
            IntrospectedTable introspectedTable) {
        generateUpdatedAtUpdateSelectiveXmlElement(element);
        return super.sqlMapUpdateByExampleSelectiveElementGenerated(element, introspectedTable);
    }

    private void generateUpdatedAtUpdateXmlElement(XmlElement element) {
        if (!hasUpdatedAt) {
            return;
        }
        int size = element.getElements().size();
        for (int i = size - 1; i > 0; i--) {
            if (element.getElements().get(i) instanceof TextElement) {
                TextElement textElement = (TextElement) element.getElements().get(i);
                if (StringUtils.startsWithIgnoreCase(textElement.getContent(), "where")) {
                    element.getElements().set(i - 1,
                            new TextElement(((TextElement) element.getElements().get(i - 1)).getContent() + ","));
                    element.getElements().add(i, generateUpdatedAtChooseXmlElement(false));
                    break;
                }
            }
        }
    }

    @Override
    public boolean sqlMapUpdateByPrimaryKeyWithBLOBsElementGenerated(XmlElement element,
            IntrospectedTable introspectedTable) {
        generateUpdatedAtUpdateXmlElement(element);
        return super.sqlMapUpdateByPrimaryKeyWithBLOBsElementGenerated(element, introspectedTable);
    }


    @Override
    public boolean sqlMapUpdateByPrimaryKeyWithoutBLOBsElementGenerated(XmlElement element,
            IntrospectedTable introspectedTable) {
        generateUpdatedAtUpdateXmlElement(element);
        return super.sqlMapUpdateByPrimaryKeyWithoutBLOBsElementGenerated(element, introspectedTable);
    }

    @Override
    public boolean sqlMapUpdateByExampleWithBLOBsElementGenerated(XmlElement element,
            IntrospectedTable introspectedTable) {
        generateUpdatedAtUpdateSelectiveXmlElement(element);
        return super.sqlMapUpdateByExampleWithBLOBsElementGenerated(element, introspectedTable);
    }

    @Override
    public boolean sqlMapUpdateByExampleWithoutBLOBsElementGenerated(XmlElement element,
            IntrospectedTable introspectedTable) {
        generateUpdatedAtUpdateXmlElement(element);
        return super.sqlMapUpdateByExampleWithoutBLOBsElementGenerated(element, introspectedTable);
    }
}
