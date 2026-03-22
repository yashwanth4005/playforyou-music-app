import { useEffect, useState } from "react";
import { USER_STORAGE_KEY, extractErrorMessage, getProfile, updateProfile } from "../lib/api";
import { SectionPanel } from "../ui/SectionPanel";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";

export default function ProfileView() {
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await getProfile();
        if (isMounted) {
          setProfile(response);
          setForm({ name: response.user.name, email: response.user.email });
        }
      } catch (error) {
        if (isMounted) {
          showToast(extractErrorMessage(error), "error");
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await updateProfile(form);
      setProfile((currentProfile) => ({ ...currentProfile, user: updatedUser }));
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      showToast("Profile updated successfully.", "success");
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return <div className="empty-state">Loading profile…</div>;
  }

  return (
    <div className="view-stack">
      <section className="profile-hero">
        <div className="profile-badge">{profile.user.name.slice(0, 1)}</div>
        <div>
          <p className="eyebrow">Account overview</p>
          <h2>{profile.user.name}</h2>
          <p>{profile.user.email}</p>
        </div>
      </section>

      <div className="stat-grid">
        <article>
          <strong>{profile.playlistsCount}</strong>
          <span>playlists</span>
        </article>
        <article>
          <strong>{profile.likedSongsCount}</strong>
          <span>liked songs</span>
        </article>
        <article>
          <strong>{profile.uploadedSongsCount}</strong>
          <span>uploaded songs</span>
        </article>
      </div>

      <SectionPanel title="Update your profile" subtitle="Keep account details in sync">
        <form className="field-grid" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm((currentForm) => ({ ...currentForm, name: event.target.value }))} />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((currentForm) => ({ ...currentForm, email: event.target.value }))}
            />
          </label>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </SectionPanel>

      <SectionPanel title="Favorite genres" subtitle="Pulled from your recent likes">
        <div className="genre-pills">
          {profile.favoriteGenres.length ? profile.favoriteGenres.map((genre) => <span key={genre}>{genre}</span>) : <span>No favorites yet</span>}
        </div>
      </SectionPanel>
    </div>
  );
}
