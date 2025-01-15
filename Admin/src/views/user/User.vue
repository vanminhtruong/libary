<template>
    <div class="card">
        <div class="text-center uppercase">
            <h1 class="text-3xl font-bold mb-6 text-center uppercase mb-[40px]">{{ t('user.title') }}</h1>
        </div>

        <div class="flex justify-content-end mb-3">
            <Button :label="t('user.addUser')" icon="pi pi-plus" @click="openDialog" />
        </div>

        <DataTable :value="users" :paginator="true" :rows="10" 
                  :rowsPerPageOptions="[5,10,20]" responsiveLayout="scroll"
                  class="user-table" @rowClick="showUserDetail($event.data)"
                  selectionMode="single">
            <Column :header="t('user.table.stt')">
                <template #body="slotProps">
                    {{ users.indexOf(slotProps.data) + 1 }}
                </template>
            </Column>
            <Column :header="t('user.table.avatar')">
                <template #body="slotProps">
                    <div>
                        <img v-if="slotProps.data.image" 
                             :src="getImageUrl(slotProps.data.image)" 
                             :alt="slotProps.data.name" 
                             class="user-image" />
                        <i v-else class="pi pi-user"></i>
                    </div>
                </template>
            </Column>
            <Column field="name" :header="t('user.table.name')">
                <template #body="slotProps">
                    <span>{{ slotProps.data.name }}</span>
                </template>
            </Column>
            <Column field="email" :header="t('user.table.email')">
                <template #body="slotProps">
                    <span>{{ slotProps.data.email }}</span>
                </template>
            </Column>
            <Column field="phone" :header="t('user.table.phone')">
                <template #body="slotProps">
                    {{ slotProps.data.phone || t('user.table.notUpdated') }}
                </template>
            </Column>
            <Column field="created_at" :header="t('user.table.createdAt')">
                <template #body="slotProps">
                    {{ new Date(slotProps.data.created_at).toLocaleDateString('vi-VN') }}
                </template>
            </Column>
            <Column :header="t('user.table.actions')">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" 
                            @click.stop="editUser(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" 
                            @click.stop="confirmDelete(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <Dialog v-model:visible="dialogVisible" 
                :header="isEditing ? t('user.editUser') : t('user.addUser')"
                :modal="true" 
                :style="{width: '450px'}" 
                class="p-fluid">
            <div class="field">
                <label for="name">{{ t('user.form.name.label') }}</label>
                <InputText id="name" v-model="userForm.name" 
                          :class="{'p-invalid': errors.name}"
                          :placeholder="t('user.form.name.placeholder')"
                          required autofocus />
                <small class="p-error text-red-500" v-if="errors.name">{{ errors.name[0] }}</small>
            </div>
            <div class="field">
                <label for="email">{{ t('user.form.email.label') }}</label>
                <InputText id="email" v-model="userForm.email" 
                         type="email"
                         :placeholder="t('user.form.email.placeholder')"
                         :class="{'p-invalid': errors.email}"
                         required />
                <small class="p-error text-red-500" v-if="errors.email">{{ errors.email[0] }}</small>
            </div>
            <div class="field">
                <label for="phone">{{ t('user.form.phone.label') }}</label>
                <InputText id="phone" v-model="userForm.phone" 
                         type="tel"
                         :placeholder="t('user.form.phone.placeholder')"
                         :class="{'p-invalid': errors.phone}" />
                <small class="p-error" v-if="errors.phone">{{ errors.phone[0] }}</small>
            </div>
            <div class="field">
                <label for="image">{{ t('user.form.image.label') }}</label>
                <FileUpload
                    mode="basic"
                    name="image"
                    :auto="false"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @select="onImageSelect"
                    @clear="onImageClear"
                    :chooseLabel="t('user.form.image.chooseImage')"
                    class="p-button-outlined w-full"
                />
                <small v-if="selectedImage" class="block mt-2">
                    {{ t('user.form.image.selected') }}: {{ selectedImage.name }}
                </small>
                <small v-else-if="userForm.image" class="block mt-2">
                    {{ t('user.form.image.current') }}: {{ userForm.image.split('/').pop() }}
                </small>
            </div>
            <template #footer>
                <div class="flex justify-content-end gap-2">
                    <Button :label="t('user.button.cancel')" icon="pi pi-times" @click="closeDialog" 
                           class="p-button-text" :disabled="submitting" />
                    <Button :label="t('user.button.save')" icon="pi pi-check" @click="handleSubmit" 
                           class="p-button-primary" :loading="submitting" />
                </div>
            </template>
        </Dialog>

        <!-- Dialog chi tiết user -->
        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <Dialog v-model:visible="detailDialog"
                :header="t('user.userDetail')"
                :modal="true"
                :style="{width: '600px'}"
                class="p-fluid user-detail-dialog">
            <div v-if="selectedUser" class="user-detail">
                <div class="flex align-items-center gap-4 mb-4 user-detail-header">
                    <div class="image-container">
                        <img v-if="selectedUser.image" 
                             :src="getImageUrl(selectedUser.image)"
                             :alt="selectedUser.name"
                             class="detail-image shadow-4" />
                        <i v-else class="pi pi-user detail-icon"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="m-0 text-xl font-bold mb-2">{{ selectedUser.name }}</h2>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-envelope text-500"></i>
                            <span>{{ selectedUser.email }}</span>
                        </div>
                        <div class="flex align-items-center gap-2 mt-2">
                            <i class="pi pi-phone text-500"></i>
                            <span>{{ selectedUser.phone || t('user.table.notUpdated') }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid user-detail-content p-3 border-round-lg surface-ground">
                    <div class="col-12 mb-3">
                        <div class="flex align-items-center justify-content-between surface-card p-3 border-round">
                            <div>
                                <span class="block font-medium mb-1">{{ t('user.detail.accountStatus') }}</span>
                                <Tag :severity="selectedUser.email_verified_at ? 'success' : 'warning'" class="text-sm">
                                    {{ selectedUser.email_verified_at ? t('user.detail.verified') : t('user.detail.notVerified') }}
                                </Tag>
                            </div>
                            <i class="pi pi-shield text-2xl text-500"></i>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="surface-card p-3 border-round h-full">
                            <span class="block font-medium mb-2">{{ t('user.detail.createdDate') }}</span>
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-calendar text-500"></i>
                                <span>{{ new Date(selectedUser.created_at).toLocaleDateString('vi-VN') }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="surface-card p-3 border-round h-full">
                            <span class="block font-medium mb-2">{{ t('user.detail.lastUpdate') }}</span>
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-clock text-500"></i>
                                <span>{{ new Date(selectedUser.updated_at).toLocaleDateString('vi-VN') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-content-end">
                    <Button :label="t('user.button.close')" 
                            icon="pi pi-times" 
                            @click="detailDialog = false" 
                            class="p-button-text" />
                </div>
            </template>
        </Dialog>

        <ConfirmDialog></ConfirmDialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { useI18n } from 'vue-i18n'
import UserService from './services/User'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import Tag from 'primevue/tag'
import FileUpload from 'primevue/fileupload'

const confirm = useConfirm()
const toast = useToast()
const { t } = useI18n()
const users = ref([])
const dialogVisible = ref(false)
const submitting = ref(false)
const errors = ref({})
const isEditing = ref(false)
const currentUserId = ref(null)
const selectedImage = ref(null)
const detailDialog = ref(false)
const selectedUser = ref(null)

const userForm = ref({
    name: '',
    email: '',
    phone: '',
    image: ''
})

const getImageUrl = (filename) => {
    return `${import.meta.env.VITE_API_URL}/user/profile/image/${filename.split('/').pop()}`
}

const fetchUsers = async () => {
    try {
        const response = await UserService.getUsers()
        users.value = response
    } catch (error) {
        console.error('Error fetching users:', error)
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: t('user.message.error.load'),
            life: 3000
        })
    }
}

const openDialog = () => {
    isEditing.value = false
    currentUserId.value = null
    userForm.value = {
        name: '',
        email: '',
        phone: '',
        image: ''
    }
    selectedImage.value = null
    dialogVisible.value = true
}

const closeDialog = () => {
    dialogVisible.value = false
    errors.value = {}
    userForm.value = {
        name: '',
        email: '',
        phone: '',
        image: ''
    }
    selectedImage.value = null
}

const editUser = (user) => {
    isEditing.value = true
    currentUserId.value = user.id
    userForm.value = {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        image: user.image || ''
    }
    selectedImage.value = null
    dialogVisible.value = true
}

const onImageSelect = (event) => {
    const file = event.files[0]
    if (file) {
        selectedImage.value = file
    }
}

const onImageClear = () => {
    selectedImage.value = null
}

const handleSubmit = async () => {
    try {
        submitting.value = true
        errors.value = {}

        const formData = new FormData()
        formData.append('name', userForm.value.name)
        formData.append('email', userForm.value.email)
        if (userForm.value.phone) {
            formData.append('phone', userForm.value.phone)
        }
        if (selectedImage.value) {
            formData.append('image', selectedImage.value)
        }

        let response
        if (isEditing.value) {
            response = await UserService.updateUser(currentUserId.value, formData)
            toast.add({
                severity: 'success',
                summary: t('user.toast.success'),
                detail: t('user.message.success.update'),
                life: 3000
            })
        } else {
            response = await UserService.createUser(formData)
            toast.add({
                severity: 'success',
                summary: t('user.toast.success'),
                detail: t('user.message.success.create'),
                life: 3000
            })
        }

        closeDialog()
        fetchUsers()
    } catch (error) {
        console.error('Error saving user:', error)
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {}
        }
    } finally {
        submitting.value = false
    }
}

const confirmDelete = (user) => {
    confirm.require({
        message: t('user.message.confirmDelete'),
        header: t('user.message.confirmTitle'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: t('user.button.delete'),
        rejectLabel: t('user.button.cancel'),
        accept: async () => {
            try {
                await UserService.deleteUser(user.id)
                toast.add({
                    severity: 'success',
                    summary: t('user.toast.success'),
                    detail: t('user.message.success.delete'),
                    life: 3000
                })
                fetchUsers()
            } catch (error) {
                console.error('Error deleting user:', error)
                toast.add({
                    severity: 'error',
                    summary: t('user.toast.error'),
                    detail: t('user.message.error.delete'),
                    life: 3000
                })
            }
        }
    })
}

const showUserDetail = async (user) => {
    try {
        const response = await UserService.getUser(user.id)
        selectedUser.value = response
        detailDialog.value = true
    } catch (error) {
        console.error('Error fetching user details:', error)
        toast.add({
            severity: 'error',
            summary: t('user.toast.error'),
            detail: t('user.message.error.loadDetail'),
            life: 3000
        })
    }
}

onMounted(() => {
    fetchUsers()
})
</script>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}

.field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

:deep(.p-inputtext) {
    width: 100%;
}

:deep(.p-dialog-content) {
    padding: 2rem;
}

.user-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

:deep(.pi-user) {
    font-size: 1.5rem;
    color: var(--surface-500);
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    opacity: 0.8;
}

.detail-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
}

.detail-icon {
    font-size: 3rem;
    color: var(--surface-500);
}

.user-detail .grid > div {
    padding: 0.5rem;
    border-bottom: 1px solid var(--surface-200);
}

.user-table :deep(tr) {
    cursor: pointer;
}

.user-table :deep(tr:hover) {
    background-color: var(--surface-100) !important;
}

.user-detail-dialog :deep(.p-dialog-content) {
    padding: 0;
}

.user-detail-header {
    padding: 2rem;
    background: linear-gradient(to right, var(--primary-100), var(--surface-100));
}

.image-container {
    position: relative;
    padding: 0.5rem;
    background: white;
    border-radius: 50%;
    box-shadow: var(--card-shadow);
}

.detail-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
}

.detail-icon {
    width: 120px;
    height: 120px;
    font-size: 3rem;
    color: var(--surface-500);
    background: var(--surface-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-detail-content {
    margin: 0 2rem 2rem 2rem;
}

.user-detail-content .surface-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.user-detail-content .surface-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow);
}
</style>
