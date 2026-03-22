import { useState } from "react";
import { extractErrorMessage, uploadSong } from "../../lib/api";
import { SectionPanel } from "../../ui/SectionPanel";
import { useToast } from "../../providers/ToastProvider";

export default function AdminUploadView() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    duration: "",
    description: "",
    audioFile: null,
    imageFile: null,
  });
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value, files } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("artist", form.artist);
    payload.append("album", form.album);
    payload.append("genre", form.genre);
    payload.append("duration", form.duration);
    payload.append("description", form.description);
    payload.append("audioFile", form.audioFile);
    if (form.imageFile) {
      payload.append("imageFile", form.imageFile);
    }

    setSubmitting(true);
    try {
      await uploadSong(payload);
      showToast("Song uploaded successfully.", "success");
      setForm({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
        description: "",
        audioFile: null,
        imageFile: null,
      });
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionPanel title="Publish a new song" subtitle="Upload audio, artwork, and metadata together">
      <form className="field-grid upload-form" onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input name="title" value={form.title} onChange={updateField} required />
        </label>
        <label>
          <span>Artist</span>
          <input name="artist" value={form.artist} onChange={updateField} required />
        </label>
        <label>
          <span>Album</span>
          <input name="album" value={form.album} onChange={updateField} required />
        </label>
        <label>
          <span>Genre</span>
          <input name="genre" value={form.genre} onChange={updateField} required />
        </label>
        <label>
          <span>Duration in seconds</span>
          <input name="duration" type="number" min="1" value={form.duration} onChange={updateField} required />
        </label>
        <label className="full-width">
          <span>Description</span>
          <textarea name="description" rows="4" value={form.description} onChange={updateField} />
        </label>
        <label>
          <span>Audio file</span>
          <input name="audioFile" type="file" accept="audio/*" onChange={updateField} required />
        </label>
        <label>
          <span>Cover image</span>
          <input name="imageFile" type="file" accept="image/*" onChange={updateField} />
        </label>
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? "Uploading…" : "Upload song"}
        </button>
      </form>
    </SectionPanel>
  );
}
