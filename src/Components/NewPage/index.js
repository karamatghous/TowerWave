import * as React from 'react'

function newPage() {
    return (
        <div
            style={{
                padding: `0px 0px 0px 70%`,
                backgroundColor: 'transparent',
                height: ' 500px',
            }}
        >
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    height: 'inherit',
                    border: '1px solid #979797',
                    padding: 30,
                }}
            >
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        margin: '5px',
                        marginBottom: 30,
                    }}
                >
                    <div
                        style={{
                            flexGrow: 1,
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <span> {`<`}</span>
                        <span
                            style={{
                                fontFamily: 'Roboto',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                fontSize: '24px',
                                color: '#262928',
                                marginLeft: '21px',
                            }}
                        >
                            Order Details
                        </span>
                    </div>
                    <div
                        style={{
                            float: 'right',
                            textAlign: 'center',
                            alignContent: 'center',
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    fontFamily: 'Roboto',
                                    fontStyle: ' normal',
                                    fontWeight: ' 400',
                                    fontSize: ' 10px',
                                    color: '#888888',
                                }}
                            >
                                Status
                            </span>
                        </div>
                        <div>
                            <span
                                style={{
                                    fontFamily: 'Roboto',
                                    fontStyle: ' normal',
                                    fontWeight: '700',
                                    fontSize: ' 13px',
                                    color: '#F7B500',
                                }}
                            >
                                On the way
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        marginBottom: '15px',
                        display: 'flex',
                    }}
                >
                    <div>
                        <div>
                            <span
                                style={{
                                    fontFamily: 'Roboto',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    color: '#222222',
                                }}
                            >
                                #A012
                            </span>
                        </div>
                        <div>
                            <span
                                style={{
                                    fontFamily: 'Roboto',
                                    fontStyle: 'normal',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    color: '#222222',
                                }}
                            >
                                Sylvia Goodman
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            columnGap: '20px',
                            display: 'flex',
                            flexGrow: 1,
                            marginLeft: '60px',
                        }}
                    >
                        <div>
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '400',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#222222',
                                    }}
                                >
                                    Shopee
                                </span>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '500',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#222222',
                                    }}
                                >
                                    Bellflower
                                </span>
                            </div>
                        </div>
                        <div
                            style={{
                                borderLeft: '2px solid #EEEEEE',
                                height: ' inherit',
                            }}
                        ></div>
                        <div>
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '500',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#888888',
                                    }}
                                >
                                    Order Total
                                </span>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '500',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#222222',
                                    }}
                                >
                                    240.000IDR
                                </span>
                            </div>
                        </div>
                        <div
                            style={{
                                borderLeft: '2px solid #EEEEEE',
                                height: ' inherit',
                            }}
                        ></div>
                        <div>
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '500',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#888888',
                                    }}
                                >
                                    Payment
                                </span>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '500',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#222222',
                                    }}
                                >
                                    Bank Transfer
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p
                        style={{
                            marginTop: 0,
                            fontFamily: 'Roboto',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '14px',
                            color: '#888888',
                        }}
                    >
                        <b
                            style={{
                                color: '#000000',
                            }}
                        >
                            Address:
                        </b>{' '}
                        PT Raena Ruma Indonesia, Gedung Cohive Uptown, Unit 3-A,
                        Jl. Timor No.16, Gondangdia, Jakarta 10350
                    </p>
                </div>
                <div style={{ height: '30px' }}>
                    <div
                        style={{
                            float: 'left',
                            color: '#1D2334',
                            fontSize: '14px',
                            fontFamily: 'Apercu',
                            fontWeight: 500,
                        }}
                    >
                        <span>3PL Partner:</span>
                        <span style={{ marginLeft: '10px' }}>SHIPPER</span>
                    </div>
                    <div
                        style={{
                            float: 'right',
                            color: '#1D2334',
                            fontSize: '14px',
                            fontFamily: 'Apercu',
                            fontWeight: 500,
                        }}
                    >
                        <span>Shipping label</span>
                        <span
                            style={{
                                background: '#F1F1F1',
                                borderRadius: '10px',
                                padding: '7px 12px',
                                color: '#777777',
                                fontSize: '14px',
                                cursor: 'pointer',
                                marginLeft: '30px',
                            }}
                        >
                            Shoping_ey.jpeg
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', marginTop: '40px' }}>
                    <img
                        src=""
                        style={{
                            width: '120px',
                            height: '100px',
                            marginRight: '15px',
                        }}
                    />
                    <div style={{ flexGrow: 1 }}>
                        <div>
                            <span
                                style={{
                                    fontFamily: 'Roboto',
                                    fontStyle: 'normal',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    color: '#222222',
                                }}
                            >
                                SOME By MI Cica Peptide Anti Hair Loss Shampoo
                            </span>
                        </div>
                        <div>
                            <span
                                style={{
                                    fontFamily: 'Roboto',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '13px',
                                    textAlign: 'center',
                                    color: '#888888',
                                    marginTop: '5px',
                                }}
                            >
                                Seller SKU: SBM033
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                columnGap: '35px',
                                marginTop: '22px',
                            }}
                        >
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '400',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#888888',
                                    }}
                                >
                                    Items
                                </span>
                                <br />
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        textAlign: 'center',
                                        color: '#888888',
                                        marginTop: '5px',
                                    }}
                                >
                                    1
                                </span>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontStyle: 'normal',
                                        fontWeight: '400',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        color: '#888888',
                                        marginTop: '5px',
                                    }}
                                >
                                    Items Total
                                </span>
                                <div
                                    style={{
                                        marginTop: '5px',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontStyle: 'normal',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            color: '#3A8D01',
                                            marginTop: '5px',
                                        }}
                                    >
                                        75.000 DR{' '}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontStyle: 'normal',
                                            fontWeight: '500',
                                            fontSize: '12px',
                                            color: '#888888',
                                            marginTop: '5px',
                                        }}
                                    >
                                        (1X 75.000IDR)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '45px' }}>
                    <span
                        style={{
                            background: '#1D2334',
                            borderRadius: '6px',
                            padding: '11px 15px',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontFamily: 'Roboto',
                            cursor: 'pointer',
                        }}
                    >
                        Arrange Pickup
                    </span>
                </div>
            </div>
        </div>
    )
}

export default newPage
