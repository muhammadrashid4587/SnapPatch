from SnapPatch.firebase_config import add_user, get_user

add_user("test123", "Test User", "test@example.com")
user = get_user("test123")
print(user)
