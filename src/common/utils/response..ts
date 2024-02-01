export async function extraUserData(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    hasPin: user.hasPin,
    referralCode: user.referralCode,
  };
}
