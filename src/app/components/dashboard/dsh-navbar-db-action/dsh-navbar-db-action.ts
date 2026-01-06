import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { exportDB, importInto } from 'dexie-export-import';
import Dexie from 'dexie';
import { DatabaseService } from '../../../app.database';

@Component({
  selector: 'app-dsh-navbar-db-action',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
  ],
  standalone: true,
  templateUrl: './dsh-navbar-db-action.html',
  styleUrl: './dsh-navbar-db-action.scss',
  providers: [MessageService]
})
export class DshNavbarDbAction {
  private messageService = inject(MessageService);
  private databaseService = inject(DatabaseService);

  _showModal = false;
  selectedFile: File | null = null;
  isUploading = false;
  isDownloading = false;

  // Ganti dengan instance Dexie database Anda
  // Contoh: private db = inject(YourDexieService).db;
  private db = this.databaseService.db;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validasi file JSON
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        this.selectedFile = file;
        this.messageService.add({
          severity: 'info',
          summary: 'File Dipilih',
          detail: `File "${file.name}" siap untuk diupload`
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'File Tidak Valid',
          detail: 'Hanya file JSON yang diperbolehkan'
        });
        this.selectedFile = null;
      }
    }
  }

  async uploadDatabase(): Promise<void> {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Peringatan',
        detail: 'Silakan pilih file terlebih dahulu'
      });
      return;
    }

    this.isUploading = true;

    try {
      // Baca file sebagai Blob
      const blob = this.selectedFile;

      // Import database menggunakan dexie-export-import
      await importInto(this.db, blob, {
        overwriteValues: true, // Timpa nilai yang ada
        clearTablesBeforeImport: true // Bersihkan tabel sebelum import
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Database berhasil diupload dan diimport'
      });

      // Reset file selection
      this.selectedFile = null;

      // Reload halaman atau update UI sesuai kebutuhan
      window.location.reload();

    } catch (error) {
      console.error('Error uploading database:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Terjadi kesalahan saat mengupload database'
      });
    } finally {
      this.isUploading = false;
    }
  }

  async downloadDatabase(): Promise<void> {
    this.isDownloading = true;

    try {
      // Export database menggunakan dexie-export-import
      const blob = await exportDB(this.db, {
        prettyJson: true // Format JSON yang mudah dibaca
      });

      // Buat nama file dengan timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `database-backup-${timestamp}.json`;

      // Download file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.messageService.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: `Database berhasil didownload: ${fileName}`
      });

    } catch (error) {
      console.error('Error downloading database:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Terjadi kesalahan saat mendownload database'
      });
    } finally {
      this.isDownloading = false;
    }
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
  }

  openModal(): void {
    this._showModal = true;
  }

  closeModal(): void {
    this._showModal = false;
    this.selectedFile = null;
  }
}