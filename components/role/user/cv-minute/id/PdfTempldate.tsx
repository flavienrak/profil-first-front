import React from 'react';
import HtmlToPdfText from '@/components/utils/HtmlToPDFText';

import { Document, Page, Text, View, Image, Font } from '@react-pdf/renderer';
import { LucidePDFIcon } from '@/components/utils/LucidePDFIcon';
import { CvMinuteSectionInterface } from '@/interfaces/role/user/cv-minute/cvMinuteSection.interface';

Font.registerHyphenationCallback((word) => [word]);

export default function PdfTempldate({
  image,
  name,
  firstname,
  contacts,
  editableSections,
  title,
  presentation,
  experiences,
  primaryBg,
  secondaryBg,
  tertiaryBg,
}: {
  image?: string;
  name?: string;
  firstname?: string;
  contacts?: CvMinuteSectionInterface[];
  editableSections?: CvMinuteSectionInterface[];

  title?: string;
  presentation?: string;
  experiences?: CvMinuteSectionInterface[];

  primaryBg: string;
  secondaryBg: string;
  tertiaryBg: string;
}) {
  return (
    <Document>
      <Page size="A4" wrap={false}>
        <View
          style={{
            width: '100%',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              width: '30%',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 14px',
              gap: '16px',
              color: '#fff',
              backgroundColor: primaryBg,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <View
                style={{
                  height: '120px',
                  width: '120px',
                  borderRadius: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                {image ? (
                  <Image
                    src={image}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: '80px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Text style={{ color: '#99a1af', fontSize: '12px' }}>
                    Votre photo ici
                  </Text>
                )}
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                {firstname && (
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'semibold',
                        fontSize: '14px',
                      }}
                    >
                      {firstname}
                    </Text>
                  </View>
                )}
                {name && (
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'semibold',
                        fontSize: '14px',
                      }}
                    >
                      {name}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {contacts && contacts.length > 0 && (
              <View
                style={{
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {contacts.map((c) => (
                  <View
                    key={`contact-${c.id}`}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <View>
                      {c.icon && c.iconSize && (
                        <LucidePDFIcon name={c.icon} size={c.iconSize} />
                      )}
                    </View>
                    <View style={{ overflow: 'hidden' }}>
                      <Text
                        style={{ fontSize: '10px', textOverflow: 'ellipsis' }}
                      >
                        {c.content}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {editableSections && editableSections.length > 0 && (
              <View
                style={{
                  flex: '1',
                  width: '100%',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                {editableSections.map((s) => (
                  <View
                    key={`editableSection-${s.id}`}
                    style={{
                      flex: '1',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        padding: '3px 4px',
                        backgroundColor: secondaryBg,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: '11px',
                          lineHeight: '13px',
                          textTransform: 'uppercase',
                          fontWeight: 'semibold',
                        }}
                      >
                        {s.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        padding: '0 5px',
                      }}
                    >
                      {s.content?.split('\n').map((line, i) => (
                        <Text
                          key={`editableSectionText-${i}`}
                          style={{ fontSize: '10px', lineHeight: '13px' }}
                        >
                          {line.trim() === '' ? ' ' : line}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View
            style={{
              width: '70%',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '16px',
              backgroundColor: '#fff',
            }}
          >
            {title && title.trim().length > 0 && (
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>
                  {title}
                </Text>
              </View>
            )}

            {presentation && presentation.trim().length > 0 && (
              <View>
                {presentation?.split('\n').map((line, i) => (
                  <Text
                    key={`presentationText-${i}`}
                    style={{
                      color: '#364153',
                      fontWeight: 'light',
                      lineHeight: '14px',
                      fontSize: '10px',
                    }}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            )}

            <View
              style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <View
                style={{
                  width: '100%',
                  padding: '6px 0',
                  borderBottom: 1.5,
                  borderBottomColor: primaryBg,
                }}
              >
                <Text
                  style={{
                    fontWeight: 'semibold',
                    fontSize: '15px',
                    textTransform: 'uppercase',
                    color: primaryBg,
                  }}
                >
                  Expériences professionnelles
                </Text>
              </View>

              {experiences && experiences.length > 0 && (
                <View
                  style={{
                    flex: '1',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  {experiences.map((item) => (
                    <View
                      key={`experience-${item.id}`}
                      style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: '10px',
                            fontWeight: 'semibold',
                            color: primaryBg,
                            width: '90px',
                          }}
                        >
                          {item.date}
                        </Text>

                        <View
                          style={{
                            flex: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          }}
                        >
                          <Text
                            wrap={false}
                            style={{
                              fontSize: '12px',
                              fontWeight: 'semibold',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.title}
                          </Text>

                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '4px',
                              padding: '3px 5px',
                              backgroundColor: tertiaryBg,
                            }}
                          >
                            <Text
                              style={{ fontSize: '10px', fontWeight: 'light' }}
                            >
                              {item.company}
                            </Text>
                            <Text
                              style={{ fontSize: '10px', fontWeight: 'light' }}
                            >
                              - ({item.contrat})
                            </Text>
                          </View>
                        </View>
                      </View>

                      {item.content?.split('\n').map((line, i) => (
                        <View key={`experienceText-${i}`}>
                          <HtmlToPdfText
                            html={line}
                            baseStyle={{ fontSize: '10px', lineHeight: '14px' }}
                          />
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
