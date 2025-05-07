import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import { parseDocument } from 'htmlparser2';
import { Node, Element, Text as DomText, DataNode, Document } from 'domhandler';

interface PdfTextStyle extends Style {
  fontWeight?: number | string;
  fontStyle?: 'italic' | 'normal' | 'oblique';
  textDecoration?:
    | 'underline'
    | 'line-through'
    | 'line-through underline'
    | 'underline line-through'
    | 'none';
}

type DomElement = Element | DomText | DataNode;

function isDomElement(node: unknown): node is DomElement {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    // On ignore les nœuds de type CDATA
    (node as Node).type !== 'cdata' &&
    isSupportedNodeType((node as Node).type)
  );
}

function isSupportedNodeType(type: string): type is Node['type'] {
  return ['tag', 'text'].includes(type);
}

function filterChildren(children: Node[]): DomElement[] {
  return children
    .filter((child) => isDomElement(child) && !(child instanceof Document))
    .map((child) => child as DomElement); // On spécifie explicitement le type ici
}

function normalizeStyle(style: Style | Style[] = {}): Style {
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
}

const renderNode = (
  node: DomElement,
  inheritedStyle: PdfTextStyle = {},
  index: number,
): React.JSX.Element | null => {
  if (node.type === 'text') {
    const textNode = node as DomText;
    const textContent = textNode.data;
    if (!textContent.trim()) return null;
    return (
      <Text key={`text-${index}`} style={inheritedStyle}>
        {textContent}
      </Text>
    );
  }

  if (node.type === 'tag') {
    const el = node as Element;
    const style: PdfTextStyle = { ...inheritedStyle };

    switch (el.name) {
      case 'b':
      case 'strong':
        style.fontWeight = 700;
        break;
      case 'i':
      case 'em':
        style.fontStyle = 'italic';
        break;
      case 'u':
        style.textDecoration = 'underline';
        break;
    }

    const children = filterChildren(el.children || [])
      .map((child, i) => renderNode(child, style, i))
      .filter(Boolean);

    if (el.name === 'br') {
      return <Text key={`br-${index}`}>{'\n'}</Text>;
    }

    return (
      <Text key={`el-${index}`} style={style}>
        {children}
      </Text>
    );
  }

  return null;
};

export default function HtmlToPdfText({
  html,
  baseStyle = {},
}: {
  html: string;
  baseStyle?: Style | Style[];
}) {
  const document = parseDocument(html);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap:
          filterChildren(document.children).length > 8
            ? '6px'
            : filterChildren(document.children).length > 4
            ? '8px'
            : '10px',
      }}
    >
      {filterChildren(document.children).map((node, i) =>
        renderNode(node as DomElement, normalizeStyle(baseStyle), i),
      )}
    </View>
  );
}
