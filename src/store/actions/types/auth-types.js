export const AuthTypes = {
    LOG_IN_SUCCESS : 'LOG_IN_SUCCESS',
    AUTH_FAIL: 'AUTH_FAIL',
    AUTH_SUCCESS: 'AUTH_SUCCESS',
    NUMBER_PASS: 'NUMBER_PASS',
    OTP_PASS: 'OTP_PASS',
    TYPE_PASS: 'TYPE_PASS',
    SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
    LOG_OUT : 'LOG_OUT',
    SET_STEP : 'SET_STEP'
}

export const stepTypes = {
    phone : 'phone',
    otp : 'otp',
    type : 'type',
    final : 'final',
}

export const stepTypesPrev = {
    phone : null,
    otp : stepTypes.phone,
    type : stepTypes.otp,
    final: stepTypes.type
}
